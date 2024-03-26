import { createClient } from "@supabase/supabase-js";
import { Board, IGameService, Piece } from "./GameServiceTypes";
import userService from "../user-service/SupabaseUserService";

type GameRecord = {
  id: string;
  board: Board;
  player_1: string;
  player_2: string;
};

class SupabaseGameService implements IGameService {
  private board: Board = Array(9).fill(null);
  private gameId: string | null = null;
  private playerPiece: Piece | null = null;
  private supabase = createClient(
    "https://jzhwssitditntmrdisuy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aHdzc2l0ZGl0bnRtcmRpc3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4OTYxMDcsImV4cCI6MjAyNjQ3MjEwN30.upIPNCjIZPaSlTuFmsVGof_AJjuAIohJ8f3iMNLIfiQ"
  );

  async createGame() {
    console.log("SupabaseGameService: Creating game");

    const { data } = await this.supabase.from("games").insert({}).select();
    const game = data?.[0] as GameRecord;

    if (!game || !game.id) {
      throw new Error("Unexpected response");
    }

    this.gameId = game.id;
    this.playerPiece = "x";
  }

  async getGame(gameId: string) {
    console.log("SupabaseGameService: Getting game", gameId);

    const { data, error } = await this.supabase
      .from("games")
      .select()
      .eq("id", gameId)
      .single();

    if (error) {
      throw new Error("Failed to get the game");
    }

    return data as GameRecord;
  }

  async joinGame(gameId: string) {
    console.log("SupabaseGameService: Joining game", gameId);

    this.gameId = gameId;

    const userId = await userService.getUserId();
    const game = await this.getGame(gameId);

    if (game.player_1 === userId) {
      console.log("SupabaseGameService: Already joined the game", game);
      this.board = game.board;
      this.playerPiece = "x";

      return;
    }

    if (game.player_2 === userId) {
      console.log("SupabaseGameService: Already joined the game", game);
      this.board = game.board;
      this.playerPiece = "o";

      return;
    }

    const { data, error } = await this.supabase
      .from("games")
      .update({ player_2: userId })
      .eq("id", gameId)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to join the game");
    }

    console.log("SupabaseGameService: Joined the game", data);
    this.board = data.board;
    this.playerPiece = "o";
  }

  public getGameId() {
    return this.gameId;
  }

  public getBoard(): Board {
    return this.board;
  }

  public getNextPiece(): Piece {
    if (this.board.filter((piece) => piece !== null).length % 2 === 0) {
      return "x";
    } else {
      return "o";
    }
  }

  public getPlayerPiece(): Piece | null {
    return this.playerPiece;
  }

  public async playNextPiece(index: number): Promise<void> {
    if (this.board[index] !== null) {
      throw new Error("Invalid move");
    }

    this.board[index] = this.getNextPiece();

    const { error } = await this.supabase
      .from("games")
      .update({ board: this.board })
      .eq("id", this.gameId);

    if (error) {
      throw new Error("Invalid move");
    }
  }

  public subscribe(callback: () => void): void {
    this.supabase
      .channel("game-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${this.gameId}`,
        },
        (payload) => {
          this.board = payload.new.board;
          callback();
        }
      )
      .subscribe();
  }

  public unsubscribe(): void {
    this.supabase.removeAllChannels();
  }
}

export default new SupabaseGameService();
