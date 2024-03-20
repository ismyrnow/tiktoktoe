import { Board, IGameService, Piece } from "./GameServiceTypes";

export default class LocalGameService implements IGameService {
  private board: Board = Array(9).fill(null);
  private nextPiece: Piece = "x";
  private onUpdateCallback: (() => void) | null = null;

  createGame(): Promise<void> {
    return Promise.resolve();
  }

  joinGame(): Promise<void> {
    return Promise.resolve();
  }

  public getGameId() {
    return "local";
  }

  public getBoard(): Board {
    return this.board;
  }

  public getNextPiece(): Piece {
    return this.nextPiece;
  }

  public async playNextPiece(index: number): Promise<void> {
    if (this.board[index] !== null) {
      throw new Error("Invalid move");
    }

    this.board[index] = this.nextPiece;
    this.nextPiece = this.nextPiece === "x" ? "o" : "x";

    this.onUpdateCallback?.();

    return Promise.resolve();
  }

  public subscribe(callback: () => void): void {
    this.onUpdateCallback = callback;
  }

  public unsubscribe(): void {
    this.onUpdateCallback = null;
  }
}
