import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import Square from "./Square.tsx";
import { GameSign } from "../../types";

const prepareButton = (content: GameSign, isWinSquare: boolean = false, onClick: () => void = () => {}): HTMLElement => {
  render(<Square value={content} isWinSquare={isWinSquare} onSquareClick={onClick} />);
  return screen.getByRole("button");
}

describe("Square", () => {
  test("renders a button", () => {
    const square: HTMLElement = prepareButton(null);
    expect(square).not.toBeNull();
  });

  test.each`
  value   | result
  ${null} | ${""}
  ${"X"}  | ${"X"}
  ${"O"}  | ${"O"}
  `(`renders $result when 'value' prop is $value`, ({ value, result }) => {
    const square: HTMLElement = prepareButton(value);
    expect(square.textContent).toBe(result);
  });

  test("calls a prop function when the button is clicked", async () => {
    const onClick = vi.fn();
    const square: HTMLElement = prepareButton("O", false, onClick);
    await userEvent.click(square)

    expect(onClick).toHaveBeenCalled();
  });

  test("square has lightgreen background when it's a win square", () => {
    const square: HTMLElement = prepareButton("X", true);
    expect(square.style.backgroundColor).toBe('lightgreen');
  });
});
