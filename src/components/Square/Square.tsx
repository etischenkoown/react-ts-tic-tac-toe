import { GameSign } from "../../types";

interface SquareProps {
  value: GameSign;
  isWinSquare: boolean;
  onSquareClick: () => void;
}

export default function Square({ value, isWinSquare, onSquareClick }: SquareProps) {
  return (
    <button
      className="square"
      style={{ backgroundColor: isWinSquare ? 'lightgreen' : '#fff' }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
