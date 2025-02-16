import "./App.css";
import Cross from "./Cross";
import Nought from "./Nought";
import CrossButton from "./CrossButton";
import NoughtButton from "./NoughtButton";
import useGameService from "./game-service/useGameService";
import { Piece, Status } from "./game-service/GameServiceTypes";
import Strike from "./Strike";

function Game() {
  const { board, nextPiece, playerPiece, playNextPiece, status, win } =
    useGameService();
  const NextPiece = nextPiece === "x" ? CrossButton : NoughtButton;
  const _isYourTurn = isYourTurn(status, playerPiece);
  const _isStatusPending = isStatusPending(status, playerPiece);

  return (
    <>
      <div className={_isStatusPending ? "status pulse" : "status"}>
        {getStatusMessage(status, playerPiece)}
      </div>
      <div className="board-container">
        <div className="board">
          {board.map((piece, index) => (
            <div className="cell" key={index}>
              {piece === "x" ? (
                <Cross />
              ) : piece === "o" ? (
                <Nought />
              ) : _isYourTurn ? (
                <NextPiece onClick={() => playNextPiece(index)} />
              ) : null}
            </div>
          ))}
        </div>
        {win && <Strike combination={win.combination} />}
      </div>
    </>
  );
}

function isStatusPending(status: Status, playerPiece: Piece | null): boolean {
  const pending =
    status === "initializing" ||
    status === "matchmaking" ||
    (status === "player1_turn" && playerPiece === "o") ||
    (status === "player2_turn" && playerPiece === "x");

  return pending;
}

function getStatusMessage(status: Status, playerPiece: Piece | null) {
  switch (status) {
    case "initializing":
      return "Connecting...";
    case "matchmaking":
      return "Waiting on a player to join...";
    case "disconnected":
      return "Opponent disconnected";
    case "player1_turn":
      return playerPiece === "x" ? "Your turn" : "Opponent's turn...";
    case "player2_turn":
      return playerPiece === "o" ? "Your turn" : "Opponent's turn...";
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

function isYourTurn(status: Status, playerPiece: Piece | null): boolean {
  return (
    (status === "player1_turn" && playerPiece === "x") ||
    (status === "player2_turn" && playerPiece === "o")
  );
}

export default Game;
