export type Session = unknown;

export default interface IUserService {
  getSession(): Promise<Session | null>;
  getUserId(): Promise<string>;
  signInAnonymously(): Promise<Session | null>;
}
