import "./App.css";
import Cross from "./Cross";
import Nought from "./Nought";
import CrossButton from "./CrossButton";
import NoughtButton from "./NoughtButton";
import { Piece, Status, Win } from "./game-service/GameServiceTypes";
import Strike from "./Strike";
import { isStatusPending } from "./game-service/game-helpers";

interface GameProps {
  board: (Piece | null)[];
  nextPiece: Piece;
  playerPiece: Piece | null;
  playNextPiece: (index: number) => void;
  status: Status;
  win: Win | null;
}

function Game({
  board,
  nextPiece,
  playerPiece,
  playNextPiece,
  status,
  win,
}: GameProps) {
  const NextPiece = nextPiece === "x" ? CrossButton : NoughtButton;
  const _isYourTurn = isYourTurn(status, playerPiece);
  const _isStatusPending = isStatusPending(status, playerPiece);

  return (
    <div
      className={_isStatusPending ? "board-container pulse" : "board-container"}
    >
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
      {win && <Strike combination={win.combination} piece={win.piece} />}
    </div>
  );
}

function isYourTurn(status: Status, playerPiece: Piece | null): boolean {
  return (
    (status === "player1_turn" && playerPiece === "x") ||
    (status === "player2_turn" && playerPiece === "o")
  );
}

export default Game;
