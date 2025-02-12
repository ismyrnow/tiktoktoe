import IUserService from "./UserServiceTypes";

class LocalUserService implements IUserService {
  private session: string | null = null;

  async getSession(): Promise<string | null> {
    console.log("Getting session");
    const session = this.session;

    if (session) {
      console.log("Existing user session found", session);
    } else {
      console.log("No existing user session found");
    }

    return Promise.resolve(session);
  }

  async signInAnonymously(): Promise<string> {
    console.log("Signing up anonymously");
    const email = `${self.crypto.randomUUID()}@tiktoktoe.ish.lol`;

    this.session = email;

    console.log("Signed up anonymously, session started", email);

    return Promise.resolve(email);
  }

  async getUserId(): Promise<string> {
    const session = await this.getSession();

    if (!session) {
      throw new Error("No session found");
    }

    return Promise.resolve(session);
  }
}

export default new LocalUserService();
