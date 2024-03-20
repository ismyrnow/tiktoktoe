import { useEffect, useRef, useState } from "react";
import { IGameService } from "./GameServiceTypes";
import SupabaseGameService from "./SupabaseGameService";

export default function useGameService(existingGameId: string | null = null) {
  const gameService = useRef<IGameService>(new SupabaseGameService());
  const [gameId, setGameId] = useState<string | null>(existingGameId);
  const [board, setBoard] = useState(gameService.current.getBoard());
  const [nextPiece, setNextPiece] = useState(
    gameService.current.getNextPiece()
  );

  useEffect(() => {
    async function initializeGame() {
      if (existingGameId) {
        await gameService.current.joinGame(existingGameId);
      } else {
        await gameService.current.createGame();
        setGameId(gameService.current.getGameId());
      }
      gameService.current.subscribe(() => {
        setBoard(gameService.current.getBoard());
        setNextPiece(gameService.current.getNextPiece());
      });
    }

    initializeGame();

    return () => {
      gameService.current.unsubscribe();
    };
  }, [existingGameId]);

  return {
    gameId,
    board,
    nextPiece,
    playNextPiece: gameService.current.playNextPiece.bind(gameService.current),
  };
}
