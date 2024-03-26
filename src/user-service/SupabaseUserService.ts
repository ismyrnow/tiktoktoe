import { Session, createClient } from "@supabase/supabase-js";
import IUserService from "./UserServiceTypes";

class SupabaseUserService implements IUserService {
  private supabase = createClient(
    "https://jzhwssitditntmrdisuy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aHdzc2l0ZGl0bnRtcmRpc3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4OTYxMDcsImV4cCI6MjAyNjQ3MjEwN30.upIPNCjIZPaSlTuFmsVGof_AJjuAIohJ8f3iMNLIfiQ"
  );

  async getSession(): Promise<Session | null> {
    console.log("Getting session");
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (data.session) {
      console.log("Existing user session found", data.session);
    } else {
      console.log("No existing user session found");
    }

    return data.session;
  }

  async signInAnonymously(): Promise<Session> {
    console.log("Signing up anonymously");
    const password = self.crypto.randomUUID();
    const email = `${self.crypto.randomUUID()}@random.tictactoe.ish.lol`;
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.session) {
      console.log("Signed up anonymously, session started", data.session);
      return data.session;
    }

    if (data.user) {
      throw new Error('Signed up, but server has "autoconfirm" off');
    }

    throw new Error("Signed up, but no session started");
  }

  async getUserId(): Promise<string> {
    const session = await this.getSession();

    if (!session) {
      throw new Error("No session found");
    }

    return session.user.id;
  }
}

export default new SupabaseUserService();
