import { useEffect, useState } from "react";
import gameService from "./SocketIOGameService";

// Use an init flag because react wants to call our useEffect twice in strict mode.
// See https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let hasStartedInit = false;

export default function useGameService(existingGameId: string | null = null) {
  const [gameId, setGameId] = useState<string | null>(existingGameId);
  const [board, setBoard] = useState(gameService.getBoard());
  const [nextPiece, setNextPiece] = useState(gameService.getNextPiece());
  const [playerPiece, setPlayerPiece] = useState(gameService.getPlayerPiece());
  const [status, setStatus] = useState(gameService.getStatus());
  const [win, setWin] = useState(gameService.getWin());

  const syncState = () => {
    const playerPiece = gameService.getPlayerPiece();
    const board = gameService.getBoard();
    const nextPiece = gameService.getNextPiece();
    const status = gameService.getStatus();
    const win = gameService.getWin();
    console.log("useGameService: Syncing state", {
      playerPiece,
      board,
      nextPiece,
      status,
      win,
    });
    setPlayerPiece(playerPiece);
    setBoard(board);
    setNextPiece(nextPiece);
    setStatus(status);
    setWin(win);
  };

  const playNextPiece = async (index: number) => {
    console.log("useGameService: Playing next piece", index);
    await gameService.playNextPiece(index);
  };

  useEffect(() => {
    if (hasStartedInit) {
      return;
    }

    hasStartedInit = true;

    (async function () {
      if (existingGameId) {
        console.log("useGameService: Joining game", existingGameId);
        await gameService.joinGame(existingGameId);
      } else {
        console.log("useGameService: Creating game");
        await gameService.createGame();
        console.log("useGameService: Game created", gameService.getGameId());
        setGameId(gameService.getGameId());
      }

      gameService.subscribe(() => {
        syncState();
      });

      syncState();
    })();

    return () => {
      gameService.unsubscribe();
    };
  }, [existingGameId]);

  return {
    gameId,
    board,
    nextPiece,
    playerPiece,
    playNextPiece,
    status,
    win,
  };
}
