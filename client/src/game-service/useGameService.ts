import { useEffect, useState } from "react";
import gameService from "./SocketIOGameService";

// Use an init flag because react wants to call our useEffect twice in strict mode.
// See https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let hasStartedInit = false;

export default function useGameService() {
  const [gameId, setGameId] = useState<string | null>(null);
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
      console.log("useGameService: Creating or joining game");

      await gameService.createOrJoinGame();

      setGameId(gameService.getGameId());

      gameService.subscribe(() => {
        syncState();
      });

      syncState();
    })();

    return () => {
      gameService.unsubscribe();
    };
  }, []);

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
