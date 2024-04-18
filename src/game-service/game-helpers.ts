import { Board, Game, Piece, Status } from "./GameServiceTypes";

export function getStatus(game: Game, userId: string | null): Status {
  if (!userId || !game.id || !game.player1 || !game.player2) {
    return "initializing";
  }

  const winningPiece = getWinningPiece(game.board);
  const playerPiece = game.player1 === userId ? "x" : "o";

  if (winningPiece) {
    if (winningPiece === playerPiece) {
      return "won";
    }

    return "lost";
  }

  if (game.board.filter((piece) => piece === null).length === 0) {
    return "draw";
  }

  if (game.board.filter((piece) => piece === null).length % 2 === 0) {
    return "your_turn";
  }

  return "opponents_turn";
}

export function getWinningPiece(board: Board): Piece | null {
  const winningCombos = [
    [0, 1, 2], // Horizontal
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Vertical
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonal
    [2, 4, 6],
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export function getNextPiece(board: Board): Piece {
  if (board.filter((piece) => piece !== null).length % 2 === 0) {
    return "x";
  } else {
    return "o";
  }
}
