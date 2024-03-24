export type Session = unknown;

export default interface IUserService {
  getSession(): Promise<Session | null>;
  signInAnonymously(): Promise<Session | null>;
}
