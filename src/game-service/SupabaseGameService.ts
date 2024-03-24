import { createClient } from "@supabase/supabase-js";
import { Board, IGameService, Piece } from "./GameServiceTypes";

type GameRecord = {
  id: string;
  board: Board;
};

class SupabaseGameService implements IGameService {
  private board: Board = Array(9).fill(null);
  private gameId: string | null = null;
  private supabase = createClient(
    "https://jzhwssitditntmrdisuy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aHdzc2l0ZGl0bnRtcmRpc3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4OTYxMDcsImV4cCI6MjAyNjQ3MjEwN30.upIPNCjIZPaSlTuFmsVGof_AJjuAIohJ8f3iMNLIfiQ"
  );

  async createGame() {
    const { data } = await this.supabase.from("games").insert({}).select();
    const game = data?.[0] as GameRecord;

    if (!game || !game.id) {
      throw new Error("Unexpected response");
    }

    this.gameId = game.id;
  }

  async joinGame(gameId: string) {
    this.gameId = gameId;
    const { data } = await this.supabase
      .from("games")
      .select()
      .eq("id", gameId)
      .single();

    if (!data) {
      throw new Error("Game not found");
    }

    this.board = data.board;
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
