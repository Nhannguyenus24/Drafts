import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import {
  IncrementMessage,
  RestartMessage,
  UpdateMessage,
  PlayerAssignedMessage,
  GameOverMessage,
  ErrorMessage,
  WaitingMessage,
  OpponentDisconnectedMessage,
  WaitingForRematchMessage,
} from './interfaces/game-message.interface';

@WebSocketGateway({
  cors: {
    origin: true, // Allow all origins
    credentials: true,
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);
  private rematchVotes = new Set<string>(); // Track who voted for rematch

  constructor(private readonly gameService: GameService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    try {
      // Assign player role
      const playerType = this.gameService.assignPlayer(client.id);

      if (!playerType) {
        // Game is full, reject the connection
        const errorMsg: ErrorMessage = {
          type: 'ERROR',
          message: 'Game is full. Only 2 players allowed.',
        };
        client.emit('message', errorMsg);
        client.disconnect();
        this.logger.warn(`Client rejected (game full): ${client.id}`);
        return;
      }

      // Send player assignment
      const assignmentMsg: PlayerAssignedMessage = {
        type: 'PLAYER_ASSIGNED',
        player: playerType,
        board: this.gameService.getBoard(),
      };
      client.emit('message', assignmentMsg);

      this.logger.log(`Player assigned: ${playerType} (${client.id})`);

      // Check if game can start
      if (this.gameService.canStartGame()) {
        this.logger.log('Both players connected. Game can start!');
        
        // Notify each player individually with their correct role
        const oddPlayerId = this.gameService.getOddPlayer();
        const evenPlayerId = this.gameService.getEvenPlayer();
        const board = this.gameService.getBoard();
        
        if (oddPlayerId) {
          const oddMsg: PlayerAssignedMessage = {
            type: 'PLAYER_ASSIGNED',
            player: 'ODD',
            board: board,
          };
          this.server.to(oddPlayerId).emit('message', oddMsg);
        }
        
        if (evenPlayerId) {
          const evenMsg: PlayerAssignedMessage = {
            type: 'PLAYER_ASSIGNED',
            player: 'EVEN',
            board: board,
          };
          this.server.to(evenPlayerId).emit('message', evenMsg);
        }
      } else {
        // Send waiting message to the player
        const waitingMsg: WaitingMessage = {
          type: 'WAITING',
          message: 'Waiting for opponent...',
        };
        client.emit('message', waitingMsg);
      }
    } catch (error) {
      this.logger.error(`Error handling connection: ${error.message}`);
      const errorMsg: ErrorMessage = {
        type: 'ERROR',
        message: 'Connection error',
      };
      client.emit('message', errorMsg);
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove from rematch votes
    this.rematchVotes.delete(client.id);

    // Check if player was in the game
    const wasInGame = this.gameService.hasPlayer(client.id);

    // Remove player from game
    this.gameService.removePlayer(client.id);

    // Notify remaining player if the game was in progress
    if (wasInGame) {
      this.logger.log('Player disconnected during game. Notifying opponent...');
      const disconnectMsg: OpponentDisconnectedMessage = {
        type: 'OPPONENT_DISCONNECTED',
        message: 'Opponent disconnected. Game over.',
      };
      this.server.emit('message', disconnectMsg);
    }
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      this.logger.debug(`Received message from ${client.id}: ${JSON.stringify(data)}`);

      // Handle different message types
      if (data.type === 'INCREMENT') {
        this.handleIncrement(data as IncrementMessage, client);
      } else if (data.type === 'RESTART_GAME') {
        this.handleRestartGame(client);
      } else {
        const errorMsg: ErrorMessage = {
          type: 'ERROR',
          message: `Unknown message type: ${data.type}`,
        };
        client.emit('message', errorMsg);
      }
    } catch (error) {
      this.logger.error(`Error handling message: ${error.message}`);
      const errorMsg: ErrorMessage = {
        type: 'ERROR',
        message: 'Invalid message format',
      };
      client.emit('message', errorMsg);
    }
  }

  private handleIncrement(data: IncrementMessage, client: Socket) {
    // Validate that both players are connected
    if (!this.gameService.canStartGame()) {
      const errorMsg: ErrorMessage = {
        type: 'ERROR',
        message: 'Waiting for opponent to join',
      };
      client.emit('message', errorMsg);
      return;
    }

    // Validate that the player is in the game
    if (!this.gameService.hasPlayer(client.id)) {
      const errorMsg: ErrorMessage = {
        type: 'ERROR',
        message: 'You are not in this game',
      };
      client.emit('message', errorMsg);
      return;
    }

    // Check if game is already over
    if (this.gameService.isGameOver()) {
      const errorMsg: ErrorMessage = {
        type: 'ERROR',
        message: 'Game is already over',
      };
      client.emit('message', errorMsg);
      return;
    }

    // Validate square index
    const square = data.square;
    if (square === undefined || square < 0 || square >= 25) {
      const errorMsg: ErrorMessage = {
        type: 'ERROR',
        message: 'Invalid square index',
      };
      client.emit('message', errorMsg);
      return;
    }

    try {
      // Apply the increment operation (operational transform!)
      const newValue = this.gameService.increment(square);

      const playerType = this.gameService.getPlayerType(client.id);
      this.logger.log(`Square ${square} incremented to ${newValue} by ${playerType}`);

      // Broadcast the update to all clients
      const updateMsg: UpdateMessage = {
        type: 'UPDATE',
        square,
        value: newValue,
      };
      this.server.emit('message', updateMsg);

      // Check for winner
      const winResult = this.gameService.checkWinner();
      if (winResult) {
        this.logger.log(`Game over! Winner: ${winResult.winner}`);
        const gameOverMsg: GameOverMessage = {
          type: 'GAME_OVER',
          winner: winResult.winner,
          winningLine: winResult.winningLine,
        };
        this.server.emit('message', gameOverMsg);
      }
    } catch (error) {
      this.logger.error(`Error processing increment: ${error.message}`);
      const errorMsg: ErrorMessage = {
        type: 'ERROR',
        message: error.message,
      };
      client.emit('message', errorMsg);
    }
  }

  private handleRestartGame(client: Socket) {
    this.logger.log(`Restart game (rematch vote) requested by ${client.id}`);

    // Add this player to rematch votes
    this.rematchVotes.add(client.id);

    const oddPlayerId = this.gameService.getOddPlayer();
    const evenPlayerId = this.gameService.getEvenPlayer();

    // Check if both players are connected
    if (!oddPlayerId || !evenPlayerId) {
      const errorMsg: ErrorMessage = {
        type: 'ERROR',
        message: 'Both players must be connected for rematch',
      };
      client.emit('message', errorMsg);
      return;
    }

    const totalPlayers = 2;
    const votedPlayers = this.rematchVotes.size;

    this.logger.log(`Rematch votes: ${votedPlayers}/${totalPlayers}`);

    // If not all players voted yet, notify and wait
    if (votedPlayers < totalPlayers) {
      // Notify the player who voted
      const waitingMsg: WaitingForRematchMessage = {
        type: 'WAITING_FOR_REMATCH',
        message: 'Waiting for opponent to accept rematch...',
        votedPlayers,
        totalPlayers,
      };
      client.emit('message', waitingMsg);

      // Notify the other player that opponent wants rematch
      const otherPlayerId = client.id === oddPlayerId ? evenPlayerId : oddPlayerId;
      const requestMsg: WaitingForRematchMessage = {
        type: 'WAITING_FOR_REMATCH',
        message: 'Opponent wants a rematch. Click Play Again to accept.',
        votedPlayers,
        totalPlayers,
      };
      this.server.to(otherPlayerId).emit('message', requestMsg);

      return;
    }

    // Both players voted - START REMATCH!
    this.logger.log('Both players voted for rematch. Starting new game...');

    // Clear votes for next game
    this.rematchVotes.clear();

    // Get both socket IDs BEFORE reset (important!)
    const oldOddPlayerId = oddPlayerId;
    const oldEvenPlayerId = evenPlayerId;

    // Reset the game state (board, gameOver flag)
    this.gameService.resetGame();

    // Re-assign players with SWAPPED roles for variety
    this.gameService.assignPlayerWithRole(oldEvenPlayerId, 'ODD');
    this.gameService.assignPlayerWithRole(oldOddPlayerId, 'EVEN');

    const board = this.gameService.getBoard();

    // Notify old ODD (now EVEN)
    const newEvenMsg: PlayerAssignedMessage = {
      type: 'PLAYER_ASSIGNED',
      player: 'EVEN',
      board: board,
    };
    this.server.to(oldOddPlayerId).emit('message', newEvenMsg);

    // Notify old EVEN (now ODD)
    const newOddMsg: PlayerAssignedMessage = {
      type: 'PLAYER_ASSIGNED',
      player: 'ODD',
      board: board,
    };
    this.server.to(oldEvenPlayerId).emit('message', newOddMsg);

    this.logger.log(`Game restarted. Players swapped roles.`);
  }
}
