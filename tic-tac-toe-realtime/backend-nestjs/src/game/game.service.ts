import { Injectable, Logger } from '@nestjs/common';
import { WinResult } from './interfaces/win-result.interface';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  private static readonly BOARD_SIZE = 5;
  private static readonly TOTAL_SQUARES = GameService.BOARD_SIZE * GameService.BOARD_SIZE;

  // All winning lines: 5 rows, 5 columns, 2 diagonals
  private static readonly WINNING_LINES: number[][] = [
    // Rows
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  // Game state
  private board: number[] = new Array(GameService.TOTAL_SQUARES).fill(0);
  private oddPlayer: string | null = null; // Socket ID of odd player
  private evenPlayer: string | null = null; // Socket ID of even player
  private gameOver = false;

  /**
   * Reset game to initial state
   */
  resetGame(): void {
    this.board = new Array(GameService.TOTAL_SQUARES).fill(0);
    this.oddPlayer = null;
    this.evenPlayer = null;
    this.gameOver = false;
    this.logger.log('Game reset');
  }

  /**
   * Assign player role (ODD or EVEN)
   */
  assignPlayer(socketId: string): 'ODD' | 'EVEN' | null {
    if (!this.oddPlayer) {
      this.oddPlayer = socketId;
      this.logger.log(`Player assigned: ODD (${socketId})`);
      return 'ODD';
    } else if (!this.evenPlayer) {
      this.evenPlayer = socketId;
      this.logger.log(`Player assigned: EVEN (${socketId})`);
      return 'EVEN';
    }
    this.logger.warn(`Game is full, rejecting player: ${socketId}`);
    return null; // Game is full
  }

  /**
   * Manually assign player with specific role (for game restart)
   */
  assignPlayerWithRole(socketId: string, role: 'ODD' | 'EVEN'): void {
    if (role === 'ODD') {
      this.oddPlayer = socketId;
      this.logger.log(`Player manually assigned: ODD (${socketId})`);
    } else {
      this.evenPlayer = socketId;
      this.logger.log(`Player manually assigned: EVEN (${socketId})`);
    }
  }

  /**
   * Remove player from game
   */
  removePlayer(socketId: string): void {
    const wasOdd = socketId === this.oddPlayer;
    const wasEven = socketId === this.evenPlayer;
    
    if (wasOdd) {
      this.logger.log(`Odd player disconnected: ${socketId}`);
      this.oddPlayer = null;
    } else if (wasEven) {
      this.logger.log(`Even player disconnected: ${socketId}`);
      this.evenPlayer = null;
    }

    // If any player disconnects, reset the entire game
    // This ensures clean state for next game
    if (wasOdd || wasEven) {
      this.logger.log('Player disconnected, resetting game for both players');
      this.resetGame();
    }
  }

  /**
   * Check if game can start (both players connected)
   */
  canStartGame(): boolean {
    return this.oddPlayer !== null && this.evenPlayer !== null;
  }

  /**
   * Get current board state
   */
  getBoard(): number[] {
    return [...this.board];
  }

  /**
   * Check if game is over
   */
  isGameOver(): boolean {
    return this.gameOver;
  }

  /**
   * Increment a square (operational transform approach)
   * Returns the new value of the square
   */
  increment(square: number): number {
    if (square < 0 || square >= GameService.TOTAL_SQUARES) {
      throw new Error(`Invalid square index: ${square}`);
    }

    if (this.gameOver) {
      throw new Error('Game is already over');
    }

    this.board[square]++;
    this.logger.debug(`Square ${square} incremented to ${this.board[square]}`);
    return this.board[square];
  }

  /**
   * Check for a winner after each move
   * Returns winner info or null
   */
  checkWinner(): WinResult | null {
    for (const line of GameService.WINNING_LINES) {
      let allOdd = true;
      let allEven = true;
      let allNonZero = true;

      for (const pos of line) {
        const value = this.board[pos];
        
        // Skip if value is 0 (unplayed square)
        if (value === 0) {
          allNonZero = false;
          break;
        }
        
        if (value % 2 === 0) {
          allOdd = false;
        } else {
          allEven = false;
        }
      }

      // Only check winner if all squares in line are non-zero
      if (allNonZero && allOdd) {
        this.gameOver = true;
        this.logger.log('ODD player wins!');
        return { winner: 'ODD', winningLine: line };
      }

      if (allNonZero && allEven) {
        this.gameOver = true;
        this.logger.log('EVEN player wins!');
        return { winner: 'EVEN', winningLine: line };
      }
    }

    return null; // No winner yet
  }

  /**
   * Check if socket ID is a player in the game
   */
  hasPlayer(socketId: string): boolean {
    return socketId === this.oddPlayer || socketId === this.evenPlayer;
  }

  /**
   * Get player type by socket ID
   */
  getPlayerType(socketId: string): 'ODD' | 'EVEN' | null {
    if (socketId === this.oddPlayer) return 'ODD';
    if (socketId === this.evenPlayer) return 'EVEN';
    return null;
  }

  /**
   * Get odd player socket ID
   */
  getOddPlayer(): string | null {
    return this.oddPlayer;
  }

  /**
   * Get even player socket ID
   */
  getEvenPlayer(): string | null {
    return this.evenPlayer;
  }
}
