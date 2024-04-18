export type Piece = "x" | "o";
export type Board = Array<Piece | null>;
export type Status =
  | "initializing"
  | "your_turn"
  | "opponents_turn"
  | "won"
  | "lost"
  | "draw";

export interface Game {
  id: string;
  board: Board;
  player1: string;
  player2: string | null;
}

export interface IGameService {
  createGame(): Promise<void>;
  joinGame(gameId: string): Promise<void>;
  getGameId(): string | null;
  getBoard(): Board;
  getPlayerPiece(): Piece | null;
  getNextPiece(): Piece;
  getStatus(): Status;
  playNextPiece(index: number): Promise<void>;
  subscribe(callback: () => void): void;
  unsubscribe(): void;
}
