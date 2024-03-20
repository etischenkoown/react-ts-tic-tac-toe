import { GameSign, Squares } from "../../types";
import { BoardProps } from "./types.ts";
import Square from "../Square/Square.tsx";

export default function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const { winner, winLine } = calculateWinner(squares);
  const isDraw = winner === null && squares.every((square) => square !== null);
  const nextSign: GameSign = xIsNext ? "X" : "O";
  let status;

  if (isDraw) {
    status = "Draw";
  } else {
    status = winner ? `Winner: ${winner}` : `Next player: ${nextSign}`;
  }

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  function renderSquaresRow(row: Squares, rowIndex: number) {
    const boardSize = 3;

    return row.map((squareValue: GameSign, squareIndex: number) => {
      const squareTrueIndex = (rowIndex * boardSize) + squareIndex;
      return (
        <Square
          key={squareTrueIndex}
          value={squareValue}
          isWinSquare={winLine?.includes(squareTrueIndex) || false}
          onSquareClick={() => handleClick(squareTrueIndex)}
        />
      )
    });
  }

  const squaresByRows = [squares.slice(0, 3), squares.slice(3, 6), squares.slice(6, 9)]
  const squareButtons = squaresByRows.map((row, rowIndex) => {
    return (
      <div key={`row-${rowIndex}`} className="board">
        {renderSquaresRow(row, rowIndex)}
      </div>
    )
  });

  return (
    <>
      <div className="status">{status}</div>
      {squareButtons}
    </>
  );
}

function calculateWinner(squares: Squares): { winner: GameSign, winLine: number[] | null } {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winLine: lines[i] };
    }
  }

  return { winner: null, winLine: null };
}
