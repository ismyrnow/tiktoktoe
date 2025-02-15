import { io, Socket } from "socket.io-client";
import {
  Board,
  Game,
  IGameService,
  Piece,
  Status,
  Win,
} from "./GameServiceTypes";
import { getWin, getStatus, BLANK_GAME } from "./game-helpers";

// Using Socket.IO on the client
class SocketIOGameService implements IGameService {
  private socket: Socket;
  private game: Game = BLANK_GAME;
  private playerPiece: Piece | null = null;

  constructor() {
    this.socket = io(`http://${window.location.hostname}:3000`, {
      autoConnect: false,
    });
  }

  async createOrJoinGame(): Promise<void> {
    console.log("SocketIOGameService: Creating or joining game");

    return new Promise((resolve, reject) => {
      this.socket.emit("createOrJoinGame");

      // Wait for the server to acknowledge
      this.socket.once("gameCreatedOrJoined", (game: Game) => {
        if (game.player2 === null) {
          console.log("SocketIOGameService: Game created", game.id);
        } else {
          console.log("SocketIOGameService: Game joined", game.id);
        }

        this.game = game;
        this.playerPiece = this.game.player1 === this.socket.id ? "x" : "o";
        resolve();
      });

      // Listen for errors if any
      this.socket.once("error", (errorMessage: string) => {
        console.log(
          "SocketIOGameService: Error creating or joining game",
          errorMessage
        );
        reject(new Error(errorMessage));
      });

      // Connect to the server
      this.socket.connect();
    });
  }

  async createGame(): Promise<void> {
    console.log("SocketIOGameService: Creating game");

    return new Promise((resolve, reject) => {
      this.socket.emit("createGame");

      // Wait for the server to acknowledge creation
      this.socket.once("gameCreated", (game: Game) => {
        console.log("SocketIOGameService: Game created", game.id);
        this.game = game;
        this.playerPiece = "x";
        resolve();
      });

      // Listen for errors if any
      this.socket.once("error", (errorMessage: string) => {
        console.log("SocketIOGameService: Error creating game", errorMessage);
        reject(new Error(errorMessage));
      });
    });
  }

  async joinGame(gameId: string): Promise<void> {
    console.log("SocketIOGameService: Joining game", gameId);

    return new Promise((resolve, reject) => {
      this.socket.emit("joinGame", gameId);

      // When the server notifies game update, use it to update locally
      this.socket.once("gameJoined", (game: Game) => {
        console.log("SocketIOGameService: Game joined", game.id);
        this.game = game;
        // Determine player piece based on room assignment.
        // Assume: If the socket id doesn't match player1 then you're player2.
        this.playerPiece = this.game.player1 === this.socket.id ? "x" : "o";
        resolve();
      });

      // Listen for errors if any
      this.socket.once("error", (errorMessage: string) => {
        console.log("SocketIOGameService: Error joining game", errorMessage);
        reject(new Error(errorMessage));
      });
    });
  }

  getGameId(): string {
    return this.game.id;
  }

  getBoard(): Board {
    return this.game.board;
  }

  getNextPiece(): Piece {
    const moves = this.game.board.filter((piece) => piece !== null).length;
    return moves % 2 === 0 ? "x" : "o";
  }

  getPlayerPiece(): Piece | null {
    return this.playerPiece;
  }

  getWin(): Win | null {
    return getWin(this.game.board);
  }

  async playNextPiece(index: number): Promise<void> {
    console.log("SocketIOGameService: Playing next piece", index);
    return new Promise((resolve, reject) => {
      if (this.game.board[index] !== null) {
        reject(new Error("Invalid move"));
        return;
      }

      this.socket.emit("makeMove", { gameId: this.game.id, index });

      // Wait for the updated game state
      this.socket.once("gameUpdated", (game: Game) => {
        console.log("SocketIOGameService: Move made", game);
        this.game = game;
        resolve();
      });

      // Listen for possible move errors
      this.socket.once("error", (errorMessage: string) => {
        console.log("SocketIOGameService: Error making move", errorMessage);
        reject(new Error(errorMessage));
      });
    });
  }

  getStatus(): Status {
    return getStatus(this.game);
  }

  subscribe(callback: () => void): void {
    this.socket.on("gameUpdated", (game: Game) => {
      console.log("SocketIOGameService: Game updated", game);
      this.game = game;
      callback();
    });
  }

  unsubscribe(): void {
    this.socket.off("gameUpdated");
  }
}

export default new SocketIOGameService();
