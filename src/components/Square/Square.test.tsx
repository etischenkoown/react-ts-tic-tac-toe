import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import Square from "./Square.tsx";
import { GameSign } from "../../types";

const prepareButton = (content: GameSign, onClick: () => void = () => {}): HTMLElement => {
  render(<Square value={content} onSquareClick={onClick} />);
  return screen.getByRole("button");
}

describe("Square", () => {
  test("renders a button", () => {
    const button = prepareButton(null);
    expect(button).not.toBeNull();
  });

  test.each`
  value   | result
  ${null} | ${""}
  ${"X"}  | ${"X"}
  ${"O"}  | ${"O"}
  `(`renders $result when 'value' prop is $value`, ({ value, result }) => {
    const button = prepareButton(value);
    expect(button.textContent).toBe(result);
  });

  test("calls a prop function when the button is clicked", async () => {
    const onClick = vi.fn();
    const button = prepareButton("O", onClick);
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalled();
  });
});
