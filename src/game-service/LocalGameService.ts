import userService from "../user-service/LocalUserService";
import { Board, IGameService, Piece } from "./GameServiceTypes";
import LocalGames from "./LocalGames";

class LocalGameService implements IGameService {
  private board: Board = Array(9).fill(null);
  private onUpdateCallback: (() => void) | null = null;
  private gameId: string | null = null;
  private playerPiece: Piece | null = null;

  async createGame(): Promise<void> {
    const userId = await userService.getUserId();

    this.gameId = self.crypto.randomUUID();
    this.playerPiece = "x";

    LocalGames.create({
      id: this.gameId,
      board: this.board,
      player1: userId,
      player2: null,
    });

    return;
  }

  async joinGame(gameId: string): Promise<void> {
    this.gameId = gameId;

    const userId = await userService.getUserId();

    const game = LocalGames.get(this.gameId);

    if (game.player1 === userId) {
      console.log("LocalGameService: Already joined the game", game);
      this.board = game.board;
      this.playerPiece = "x";
      return;
    } else if (game.player2 === userId) {
      console.log("LocalGameService: Already joined the game", game);
      this.board = game.board;
      this.playerPiece = "o";
      return;
    }

    // Boots player 2 if already exists
    const updatedGame = LocalGames.update({
      id: this.gameId,
      player2: userId,
    });

    this.board = updatedGame.board;
    this.playerPiece = "o";

    return;
  }

  public getGameId() {
    return this.gameId;
  }

  public getBoard(): Board {
    return this.board;
  }

  public getPlayerPiece(): Piece | null {
    return this.playerPiece;
  }

  public getNextPiece(): Piece {
    if (this.board.filter((piece) => piece !== null).length % 2 === 0) {
      return "x";
    } else {
      return "o";
    }
  }

  public async playNextPiece(index: number): Promise<void> {
    if (this.board[index] !== null) {
      throw new Error("Invalid move");
    }

    this.board[index] = this.getNextPiece();

    LocalGames.update({
      id: this.gameId!,
      board: this.board,
    });

    this.onUpdateCallback?.();

    return Promise.resolve();
  }

  public subscribe(callback: () => void): void {
    this.onUpdateCallback = () => {
      this.board = LocalGames.get(this.gameId!).board;
      callback();
    };
    LocalGames.subscribe(this.onUpdateCallback);
  }

  public unsubscribe(): void {
    LocalGames.unsubscribe();
  }
}

export default new LocalGameService();
