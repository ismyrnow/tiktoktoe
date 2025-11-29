import { Board, Game, Piece, Status, Win } from "./GameServiceTypes";

export const BLANK_GAME: Game = {
  id: "",
  board: Array(9).fill(null),
  player1: "",
  player2: null,
};

export function getStatus(game: Game): Status {
  if (!game.id) {
    return "initializing";
  }

  if (game.player1 === "disconnected" || game.player2 === "disconnected") {
    return "disconnected";
  }

  if (game.player1 === game.player2) {
    return "invalid";
  }

  if ((game.player1 && !game.player2) || (game.player2 && !game.player1)) {
    return "matchmaking";
  }

  const win = getWin(game.board);

  // If there is a winning piece, return who won
  if (win) {
    if (win.piece === "x") {
      return "player1_won";
    } else if (win.piece === "o") {
      return "player2_won";
    }
  }

  // If there are no more empty cells, it's a draw
  if (game.board.filter((piece) => piece === null).length === 0) {
    return "draw";
  }

  const nextPiece = getNextPiece(game.board);

  // Otherwise, return whose turn it is
  if (nextPiece === "x") {
    return "player1_turn";
  } else if (nextPiece === "o") {
    return "player2_turn";
  }

  return "invalid";
}

export function getWin(board: Board): Win | null {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { piece: board[a] as Piece, combination };
    }
  }

  return null;
}

export function getNextPiece(board: Board): Piece | null {
  const numPieces = board.filter((piece) => piece !== null).length;

  if (numPieces === 9) {
    return null;
  } else if (numPieces % 2 === 0) {
    return "x";
  } else {
    return "o";
  }
}

export function isStatusPending(
  status: Status,
  playerPiece: Piece | null
): boolean {
  const pending =
    status === "initializing" ||
    status === "matchmaking" ||
    (status === "player1_turn" && playerPiece === "o") ||
    (status === "player2_turn" && playerPiece === "x");

  return pending;
}

export function isStatusPregame(status: Status): boolean {
  return status === "initializing" || status === "matchmaking";
}

export function isStatusEndgame(status: Status): boolean {
  return (
    status === "player1_won" ||
    status === "player2_won" ||
    status === "draw" ||
    status === "disconnected"
  );
}
