export type Piece = "x" | "o";
export type Board = Array<Piece | null>;

export interface IGameService {
  createGame(): Promise<void>;
  joinGame(gameId: string): Promise<void>;
  getGameId(): string | null;
  getBoard(): Board;
  getPlayerPiece(): Piece | null;
  getNextPiece(): Piece;
  playNextPiece(index: number): Promise<void>;
  subscribe(callback: () => void): void;
  unsubscribe(): void;
}
