import { useEffect, useState } from "react";
import gameService from "./SupabaseGameService";

export default function useGameService(existingGameId: string | null = null) {
  const [gameId, setGameId] = useState<string | null>(existingGameId);
  const [board, setBoard] = useState(gameService.getBoard());
  const [nextPiece, setNextPiece] = useState(gameService.getNextPiece());
  const syncState = () => {
    setBoard(gameService.getBoard());
    setNextPiece(gameService.getNextPiece());
  };

  useEffect(() => {
    async function initializeGame() {
      if (existingGameId) {
        console.log("Joining game", existingGameId);
        await gameService.joinGame(existingGameId);
      } else {
        console.log("Creating game");
        await gameService.createGame();
        setGameId(gameService.getGameId());
      }

      gameService.subscribe(() => {
        syncState();
      });

      syncState();
    }

    initializeGame();

    return () => {
      gameService.unsubscribe();
    };
  }, [existingGameId]);

  return {
    gameId,
    board,
    nextPiece,
    playNextPiece: gameService.playNextPiece.bind(gameService),
  };
}
