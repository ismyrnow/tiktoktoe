import "./App.css";
import Game from "./Game";
import {
  isStatusEndgame,
  isStatusPending,
  isStatusPregame,
} from "./game-service/game-helpers";
import { Piece, Status } from "./game-service/GameServiceTypes";
import useGameService from "./game-service/useGameService";

function App() {
  const { board, nextPiece, playerPiece, playNextPiece, status, win } =
    useGameService();
  const _isStatusPending = isStatusPending(status, playerPiece);
  const _isStatusPregame = isStatusPregame(status);
  const _isStatusEndgame = isStatusEndgame(status);

  if (_isStatusPregame) {
    return (
      <>
        <div className="logo">
          <a href="/">
            <img src="/logo-square.png" alt="TikTokToe" />
          </a>
        </div>
        <div className={_isStatusPending ? "status pulse" : "status"}>
          {getStatusMessage(status, playerPiece)}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="logo narrow">
        <a href="/">
          <img src="/logo-narrow.png" alt="TikTokToe" />
        </a>
      </div>
      <Game
        board={board}
        nextPiece={nextPiece}
        playerPiece={playerPiece}
        playNextPiece={playNextPiece}
        status={status}
        win={win}
      />
      <div className={_isStatusPending ? "status pulse" : "status"}>
        {getStatusMessage(status, playerPiece)}
        {_isStatusEndgame && (
          <button className="button" onClick={() => window.location.reload()}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.5em" }}
            >
              <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M19 3V6.5H15.5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Play again
          </button>
        )}
      </div>
    </>
  );
}

function getStatusMessage(status: Status, playerPiece: Piece | null) {
  switch (status) {
    case "initializing":
      return "Connecting...";
    case "matchmaking":
      return "Waiting for another player...";
    case "disconnected":
      return "Opponent disconnected";
    case "player1_turn":
      return playerPiece === "x" ? "Your turn" : "Opponent's turn...";
    case "player2_turn":
      return playerPiece === "o" ? "Your turn" : "Opponent's turn...";
    case "player1_won":
      return playerPiece === "x" ? "😄 You won!" : "😵 You lost!";
    case "player2_won":
      return playerPiece === "o" ? "😄 You won!" : "😵 You lost!";
    case "draw":
      return "It's a draw";
    default:
      return "Invalid state";
  }
}

export default App;
