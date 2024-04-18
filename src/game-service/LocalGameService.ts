import userService from "../user-service/LocalUserService";
import { Game, IGameService, Piece, Status } from "./GameServiceTypes";
import LocalGames from "./LocalGames";
import { getNextPiece, getStatus } from "./game-helpers";

const BlankGame: Game = {
  id: "",
  board: Array(9).fill(null),
  player1: "",
  player2: null,
};

class LocalGameService implements IGameService {
  private userId: string | null = null;
  private game: Game = BlankGame;
  private onUpdateCallback: (() => void) | null = null;

  async createGame(): Promise<void> {
    this.userId = await userService.getUserId();

    this.game = LocalGames.create({
      id: self.crypto.randomUUID(),
      board: Array(9).fill(null),
      player1: this.userId,
      player2: null,
    });

    return;
  }

  async joinGame(gameId: string): Promise<void> {
    const userId = await userService.getUserId();

    const game = LocalGames.get(gameId);

    if (game.player1 === userId || game.player2 === userId) {
      console.log("LocalGameService: Already joined the game", game);
    } else {
      // Boots player 2 if already exists
      this.game = LocalGames.update({
        id: gameId,
        player2: userId,
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

  public getNextPiece(): Piece {
    return getNextPiece(this.game.board);
  }

  public getStatus(): Status {
    return getStatus(this.game, this.userId);
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
