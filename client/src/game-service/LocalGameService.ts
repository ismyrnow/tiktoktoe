import { Game, IGameService, Piece, Status, Win } from "./GameServiceTypes";
import LocalGames from "./LocalGames";
import { BLANK_GAME, getNextPiece, getStatus, getWin } from "./game-helpers";

const USER_ID = `usr_${self.crypto.randomUUID()}`;

class LocalGameService implements IGameService {
  private userId: string | null = null;
  private game: Game = BLANK_GAME;
  private onUpdateCallback: (() => void) | null = null;

  async createGame(): Promise<void> {
    this.game = LocalGames.create({
      id: self.crypto.randomUUID(),
      board: Array(9).fill(null),
      player1: USER_ID,
      player2: null,
    });

    return;
  }

  async joinGame(gameId: string): Promise<void> {
    const game = LocalGames.get(gameId);

    if (game.player1 === USER_ID || game.player2 === USER_ID) {
      console.log("LocalGameService: Already joined the game", game);
    } else {
      // Boots player 2 if already exists
      this.game = LocalGames.update({
        id: gameId,
        player2: USER_ID,
      });
    }

    return;
  }

  public getGameId() {
    return this.game.id;
  }

  public getBoard() {
    return this.game.board;
  }

  public getPlayerPiece(): Piece {
    return this.game.player1 === this.userId ? "x" : "o";
  }

  public getNextPiece(): Piece | null {
    return getNextPiece(this.game.board);
  }

  public getStatus(): Status {
    return getStatus(this.game);
  }

  public getWin(): Win | null {
    return getWin(this.game.board);
  }

  public async playNextPiece(index: number): Promise<void> {
    if (this.game.board[index] !== null) {
      throw new Error("Invalid move");
    }

    const board = this.game.board.slice();
    board[index] = this.getNextPiece();

    this.game = LocalGames.update({
      id: this.game.id,
      board,
    });

    this.onUpdateCallback?.();

    return Promise.resolve();
  }

  public subscribe(callback: () => void): void {
    this.onUpdateCallback = () => {
      this.game = LocalGames.get(this.game.id);
      callback();
    };
    LocalGames.subscribe(this.onUpdateCallback);
  }

  public unsubscribe(): void {
    LocalGames.unsubscribe();
  }
}

export default new LocalGameService();
