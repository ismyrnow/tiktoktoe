export type Piece = "x" | "o";
export type Board = Array<Piece | null>;
export type Status =
  | "initializing"
  | "player1_turn"
  | "player2_turn"
  | "player1_won"
  | "player2_won"
  | "draw"
  | "invalid";

export interface Game {
  id: string;
  board: Board;
  player1: string;
  player2: string | null;
}

export interface Win {
  piece: Piece;
  combination: number[];
}

export interface IGameService {
  createGame(): Promise<void>;
  joinGame(gameId: string): Promise<void>;
  getGameId(): string | null;
  getBoard(): Board;
  getPlayerPiece(): Piece | null;
  getNextPiece(): Piece | null;
  getStatus(): Status;
  getWin(): { piece: Piece; combination: number[] } | null;
  playNextPiece(index: number): Promise<void>;
  subscribe(callback: () => void): void;
  unsubscribe(): void;
}
