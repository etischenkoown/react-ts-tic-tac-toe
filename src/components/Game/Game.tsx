import { useState } from "react";
import { GameSign, Order, Squares } from "../../types";
import Board from "../Board/Board.tsx";

type History = Squares[];

export default function Game() {
  const [history, setHistory] = useState<History>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [movesOrder, setMovesOrder] = useState(Order.ASC);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: Squares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function changeMovesOrder() {
    setMovesOrder(movesOrder === Order.ASC ? Order.DESC : Order.ASC);
  }

  function getMoveCoords(move: number): string {
    const historyMove: Squares = history[move];
    const prevHistoryMove: Squares = history[move - 1];

    const BOARD_SIZE = 3;
    const addedIndex = historyMove.findIndex((player: GameSign, index) => prevHistoryMove[index] !== player);
    const row = Math.ceil((addedIndex + 1) / BOARD_SIZE);
    const col = (addedIndex % BOARD_SIZE) + 1;
    const player: GameSign = move % 2 === 0 ? "O" : "X";

    return `(${player}: ${row}, ${col})`
  }

  const moves = history.map((_squares: Squares, move: number) => {
    const description = move > 0 ? `Go to move #${move}` : "Go to game start";
    const isCurrentMove = move === currentMove && move > 0;

    return (
      <li key={move}>
        {!isCurrentMove && <button
          onClick={() => {
            jumpTo(move);
          }}
        >
          {description}
        </button>}
        {isCurrentMove && <span>You are at move #{move}</span>}
        {move > 0 && " " + getMoveCoords(move)}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={changeMovesOrder}>Change order</button>
        <ol>
          {movesOrder === Order.DESC ? moves.reverse() : moves}
        </ol>
      </div>
    </div>
  );
}
