import { useEffect, useState } from "react";
import gameService from "./SupabaseGameService";

export default function useGameService(existingGameId: string | null = null) {
  const [gameId, setGameId] = useState<string | null>(existingGameId);
  const [board, setBoard] = useState(gameService.getBoard());
  const [nextPiece, setNextPiece] = useState(gameService.getNextPiece());

  useEffect(() => {
    async function initializeGame() {
      if (existingGameId) {
        await gameService.joinGame(existingGameId);
      } else {
        await gameService.createGame();
        setGameId(gameService.getGameId());
      }
      gameService.subscribe(() => {
        setBoard(gameService.getBoard());
        setNextPiece(gameService.getNextPiece());
      });
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
