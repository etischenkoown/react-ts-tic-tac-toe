import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import Game from "./Game.tsx";

const getSquaresElements = (): HTMLElement[] => {
  return screen.getAllByRole("button", { name: /^([XO]|$)|^$/ }); // "X" or "O" or empty string
}

describe("Game", () => {
  test("next player is O after X makes a move", async () => {
    render(<Game />);
    const squares: HTMLElement[] = getSquaresElements();

    await userEvent.click(squares[0]);

    expect(screen.getByText("Next player: O")).not.toBeNull();
  });

  test("next player is X after X and O make moves", async () => {
    render(<Game />);
    const squares: HTMLElement[] = getSquaresElements();

    await userEvent.click(squares[0]);
    await userEvent.click(squares[1]);

    expect(screen.getByText("Next player: X")).not.toBeNull();
  });

  test("shows all moves", async () => {
    render(<Game />);
    const squares: HTMLElement[] = getSquaresElements();

    await userEvent.click(squares[0]);
    await userEvent.click(squares[1]);
    await userEvent.click(squares[2]);

    const moves = screen.getAllByRole("button", { name: /^Go to move #[1-9]+$/ });
    expect(moves).toHaveLength(2);
  });

  test("shows current move as 'You are at move #...' text", async () => {
    render(<Game />);
    const squares: HTMLElement[] = getSquaresElements();

    await userEvent.click(squares[0]);
    await userEvent.click(squares[1]);
    await userEvent.click(squares[2]);

    const currentMoveText = screen.getByText(/^You are at move #3/);
    expect(currentMoveText).not.toBeNull();
  });

  test("shows current move as 'You are at move #...' after jumping to previous move", async () => {
    render(<Game />);
    const squares: HTMLElement[] = getSquaresElements();

    await userEvent.click(squares[0]);
    await userEvent.click(squares[1]);
    await userEvent.click(squares[2]);
    const goToMoveButton: HTMLElement = screen.getByRole("button", { name: "Go to move #2" });
    await userEvent.click(goToMoveButton);

    const currentMoveText = screen.getByText(/^You are at move #2/);
    expect(currentMoveText).not.toBeNull();
  });

  test("show Go to game start button on the game start", () => {
    render(<Game />);
    const button: HTMLElement = screen.getByRole("button", { name: "Go to game start" });
    expect(button).not.toBeNull();
  });

  test("always show Go to game start button", async () => {
    render(<Game />);
    const squares = getSquaresElements();

    await userEvent.click(squares[0]);
    await userEvent.click(squares[1]);
    await userEvent.click(squares[2]);

    const moves = screen.getAllByRole("button", { name: "Go to game start" });
    expect(moves).toHaveLength(1);
  });

  test("clears all squares after jumping to game start", async () => {
    render(<Game />);
    const squares: HTMLElement[] = getSquaresElements();
    const goToStartButton: HTMLElement = screen.getByRole("button", { name: "Go to game start" });

    await userEvent.click(squares[0]);
    await userEvent.click(squares[1]);
    await userEvent.click(squares[2]);
    await userEvent.click(goToStartButton);

    squares.forEach((square) => {
      expect(square.textContent).toBe("");
    });
  });

  test("correctly changes square after jumping to move", async () => {
    render(<Game />);
    const squares: HTMLElement[] = getSquaresElements();

    await userEvent.click(squares[0]);
    await userEvent.click(squares[1]);
    await userEvent.click(squares[2]);

    const goToMoveButton: HTMLElement = screen.getByRole("button", { name: "Go to move #2" });
    await userEvent.click(goToMoveButton);

    expect(squares[0].textContent).toBe("X");
    expect(squares[1].textContent).toBe("O");
    expect(squares[2].textContent).toBe("");
  });
});
