import "./App.css";
import Cross from "./Cross";
import Nought from "./Nought";
import CrossButton from "./CrossButton";
import NoughtButton from "./NoughtButton";
import useGameService from "./game-service/useGameService";
import { useEffect } from "react";

interface Props {
  initialGameId?: string;
}

function Game({ initialGameId }: Props) {
  const { gameId, board, nextPiece, playerPiece, playNextPiece } =
    useGameService(initialGameId);
  const NextPiece = nextPiece === "x" ? CrossButton : NoughtButton;

  useEffect(() => {
    if (gameId) {
      window.history.pushState({}, "", gameId);
    }
  }, [gameId]);

  if (!gameId) {
    if (initialGameId) {
      return <div>Joining a game...</div>;
    } else {
      return <div>Starting a game...</div>;
    }
  }

  return (
    <>
      <div className="board">
        {board.map((piece, index) => (
          <div className="cell" key={index}>
            {piece === "x" ? (
              <Cross />
            ) : piece === "o" ? (
              <Nought />
            ) : nextPiece === playerPiece ? (
              <NextPiece onClick={() => playNextPiece(index)} />
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

export default Game;
