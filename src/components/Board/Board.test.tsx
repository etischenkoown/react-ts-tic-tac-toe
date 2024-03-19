import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import Board from "./Board.tsx";
import { GameSign, Squares } from "../../types";
import { BoardProps } from "./types.ts";

const createEmptySquares = (): Squares => Array(9).fill(null);

const getBoardProps = ({ xIsNext = true, squares = createEmptySquares(), onPlay = () => {} }: {
  xIsNext?: boolean;
  squares?: Squares;
  onPlay?: (squares: Squares) => void;
} = {
}): BoardProps => ({
  xIsNext,
  squares,
  onPlay,
});

const prepareBoard = ({ xIsNext, squares = createEmptySquares(), onPlay = () => {} }: BoardProps) => {
  render(<Board xIsNext={xIsNext} squares={squares} onPlay={onPlay} />);
}
describe("Board", () => {
  test("renders 9 empty squares on a game start", () => {
    prepareBoard(getBoardProps());
    const squares = screen.getAllByRole("button");
    expect(squares).toHaveLength(9);
  });

  test("renders 'Next player: X' on a game start", () => {
    prepareBoard((getBoardProps()));
    expect(screen.getByText("Next player: X")).not.toBeNull();
  });

  test("renders 'Next player: O' when next player is O", () => {
    const squares = createEmptySquares();
    squares[0] = "X";
    prepareBoard(getBoardProps({ xIsNext: false, squares }));

    expect(screen.getByText("Next player: O")).not.toBeNull();
  });

  test.each([
    { sign: 'X' },
    { sign: 'O' },
  ])('renders "Winner: $sign" when $sign wins', ({ sign }) => {
    const squares = createEmptySquares();
    squares[0] = sign as GameSign
    squares[1] = sign as GameSign;
    squares[2] = sign as GameSign;
    prepareBoard(getBoardProps({ squares }));

    expect(screen.getByText(`Winner: ${sign}`)).not.toBeNull();
  });

  test('renders "Draw" when there is no winner', () => {
    const squares: Squares = [
      "X", "O", "X",
      "X", "O", "O",
      "O", "X", "X"
    ];
    prepareBoard(getBoardProps({ squares }));

    expect(screen.getByText("Draw")).not.toBeNull();
  });

  test("correctly renders filled squares", () => {
    const squares: Squares = ["X", "O", "X", "O", "X", "O", null, null, null];
    prepareBoard(getBoardProps({ squares }));

    const renderedSquares = screen.getAllByRole("button");
    renderedSquares.forEach((square, index) => {
      expect(square.textContent).toBe(squares[index] || "");
    });
  });

  test("should not trigger onPlay callback when a square is already filled", async () => {
    const onPlay = vi.fn();
    const squares: Squares = ["X", "O", "X", "O", "X", "O", null, null, null];
    prepareBoard(getBoardProps({ squares, onPlay }));

    const square = screen.getAllByRole("button")[0];
    await userEvent.click(square);

    expect(onPlay).not.toHaveBeenCalled();
  });

  test("should not trigger onPlay callback when there is a winner", async () => {
    const onPlay = vi.fn();
    const squares: Squares = ["X", "X", "X", "O", "O", null, null, null, null];
    prepareBoard(getBoardProps({ squares, onPlay }));

    const emptySquare = screen.getAllByRole("button")[5];
    await userEvent.click(emptySquare);

    expect(onPlay).not.toHaveBeenCalled();
  });

  test("should trigger onPlay callback when there is no winner yet", async () => {
    const onPlay = vi.fn();
    const squares: Squares = ["X", null, "X", "O", "O", null, null, null, null];
    prepareBoard(getBoardProps({ squares, onPlay }));

    const emptySquare = screen.getAllByRole("button")[5];
    await userEvent.click(emptySquare);

    expect(onPlay).toHaveBeenCalled();
  });

  test.each([
    { start: createEmptySquares(), move: [0, "X"], next: ["X", null, null, null, null, null, null, null, null] },
    { start: createEmptySquares(), move: [8, "O"], next: [null, null, null, null, null, null, null, null, "O"] },
    {
      start: ["X", "O", "O", null, null, null, null, null, null],
      move: [3, "X"],
      next: ["X", "O", "O", "X", null, null, null, null, null]
    },
  ] as { start: Squares, move: [number, GameSign], next: Squares }[])('triggers onPlay callback with correct squares when player $move.1 clicks a $move.0 square', async ({ start, move, next }) => {
    const [squareIndex, sign]: [number, GameSign] = move;
    const xIsNext = sign === "X";
    const boardProps = getBoardProps({ xIsNext, squares: start, onPlay: vi.fn() });
    prepareBoard(boardProps);

    const square = screen.getAllByRole("button")[squareIndex];
    await userEvent.click(square);

    expect(boardProps.onPlay).toHaveBeenCalledWith(next);
  });
});
