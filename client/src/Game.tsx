import "./App.css";
import Cross from "./Cross";
import Nought from "./Nought";
import CrossButton from "./CrossButton";
import NoughtButton from "./NoughtButton";
import useGameService from "./game-service/useGameService";
import { Piece, Status } from "./game-service/GameServiceTypes";
import { useEffect } from "react";
import Player from "./Player";
import Strike from "./Strike";

function Game() {
  const { gameId, board, nextPiece, playerPiece, playNextPiece, status, win } =
    useGameService();
  const opponentPiece = playerPiece === "x" ? "o" : "x";
  const isYourTurn = win ? false : nextPiece === playerPiece;
  const NextPiece = nextPiece === "x" ? CrossButton : NoughtButton;

  useEffect(() => {
    if (gameId) {
      window.history.pushState({}, "", gameId);
    }
  }, [gameId]);

  if (!playerPiece) {
    return <div>Inititializing...</div>;
  }

  if (status === "initializing") {
    if (playerPiece === "x") {
      return <div>Waiting for other player to join...</div>;
    } else {
      return <div>Joining an existing game...</div>;
    }
  }
  const You = (
    <Player
      active={win ? win.piece === playerPiece : isYourTurn}
      name="You"
      piece={playerPiece}
    />
  );
  const Opponent = (
    <Player
      active={win ? win.piece === opponentPiece : !isYourTurn}
      name="Opponent"
      piece={opponentPiece}
    />
  );

  const Player1 = playerPiece === "x" ? You : Opponent;
  const Player2 = playerPiece === "o" ? You : Opponent;

  return (
    <>
      <div className="players">
        {Player1}
        <div className="vs">vs</div>
        {Player2}
      </div>
      <div className="board-container">
        <div className="board">
          {board.map((piece, index) => (
            <div className="cell" key={index}>
              {piece === "x" ? (
                <Cross />
              ) : piece === "o" ? (
                <Nought />
              ) : isYourTurn ? (
                <NextPiece onClick={() => playNextPiece(index)} />
              ) : null}
            </div>
          ))}
        </div>
        {win && <Strike combination={win.combination} />}
      </div>
      <div className="status">{getStatusMessage(status, playerPiece)}</div>
    </>
  );
}

function getStatusMessage(status: Status, playerPiece: Piece) {
  switch (status) {
    case "player1_turn":
      return playerPiece === "x" ? "Your turn" : "Opponent's turn";
    case "player2_turn":
      return playerPiece === "o" ? "Your turn" : "Opponent's turn";
    case "player1_won":
      return playerPiece === "x" ? "You won!" : "You lost";
    case "player2_won":
      return playerPiece === "o" ? "You won!" : "You lost";
    case "draw":
      return "It's a draw";
    default:
      return "Invalid state";
  }
}

export default Game;
