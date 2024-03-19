import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Square from "./Square.tsx";
import { GameSign } from "../../types";

const prepareButton = (content: GameSign, onClick: () => void = () => {}): HTMLElement | null => {
  const { getByRole } = render(<Square value={content} onSquareClick={onClick} />);
  return getByRole("button");
}

describe("Square", () => {
  test("renders a button", () => {
    const button = prepareButton(null);
    expect(button).not.toBeNull();
  });

  // @todo: utilize test`renders a button` to test the following
  test("renders an empty square", () => {
    const button = prepareButton(null);
    expect(button?.textContent).toBe("");
  });

  test("renders with X", () => {
    const button = prepareButton("X");
    expect(button?.textContent).toBe("X");
  });

  test("renders with O", () => {
    const button = prepareButton("O");
    expect(button?.textContent).toBe("O");
  });

  test("calls a prop function when the button is clicked", () => {
    const onClick = vi.fn();
    const button = prepareButton("O", onClick);
    button?.click();
    expect(onClick).toHaveBeenCalled();
  });
});
