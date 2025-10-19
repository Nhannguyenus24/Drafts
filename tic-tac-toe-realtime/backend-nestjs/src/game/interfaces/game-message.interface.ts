export interface GameMessage {
  type: string;
  square?: number;
  value?: number;
  player?: string;
  board?: number[];
  winner?: string;
  winningLine?: number[];
  message?: string;
}

export interface IncrementMessage {
  type: 'INCREMENT';
  square: number;
}

export interface RestartMessage {
  type: 'RESTART_GAME';
}

export interface UpdateMessage {
  type: 'UPDATE';
  square: number;
  value: number;
}

export interface PlayerAssignedMessage {
  type: 'PLAYER_ASSIGNED';
  player: 'ODD' | 'EVEN';
  board: number[];
}

export interface GameOverMessage {
  type: 'GAME_OVER';
  winner: 'ODD' | 'EVEN';
  winningLine: number[];
}

export interface ErrorMessage {
  type: 'ERROR';
  message: string;
}

export interface WaitingMessage {
  type: 'WAITING';
  message: string;
}

export interface OpponentDisconnectedMessage {
  type: 'OPPONENT_DISCONNECTED';
  message: string;
}

export interface WaitingForRematchMessage {
  type: 'WAITING_FOR_REMATCH';
  message: string;
  votedPlayers: number;
  totalPlayers: number;
}
