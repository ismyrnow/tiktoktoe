import { Board } from "./GameServiceTypes";

const STORAGE_KEY = "local_games";

class Storage {
  public static get<T>(key: string): T | null {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  public static set<T>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export default class Games {
  private static storageEventListener:
    | ((event: StorageEvent) => void)
    | undefined;

  private static getGames(): Record<string, Game> {
    return Storage.get(STORAGE_KEY) || {};
  }

  public static create(game: Game): Game {
    const games = this.getGames();

    games[game.id] = game;

    Storage.set(STORAGE_KEY, games);

    return game;
  }

  public static get(id: string): Game {
    const games = this.getGames();

    return games[id];
  }

  public static update(game: Partial<Game> & Pick<Game, "id">): Game {
    const games = this.getGames();

    const existingGame = games[game.id];
    const newGame = { ...existingGame, ...game };

    games[game.id] = newGame;

    Storage.set(STORAGE_KEY, games);

    return newGame;
  }

  public static clear(): void {
    Storage.set(STORAGE_KEY, {});
  }

  public static subscribe(callback: () => void): void {
    if (this.storageEventListener) {
      throw new Error("Already subscribed");
    }

    this.storageEventListener = ({ key }) => {
      if (key === STORAGE_KEY) {
        callback();
      }
    };

    window.addEventListener("storage", this.storageEventListener);
  }

  public static unsubscribe(): void {
    if (this.storageEventListener) {
      window.removeEventListener("storage", this.storageEventListener);
    }
  }
}

interface Game {
  id: string;
  board: Board;
  player1: string;
  player2: string | null;
}
