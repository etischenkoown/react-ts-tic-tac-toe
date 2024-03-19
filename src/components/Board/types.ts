import { Squares } from "../../types";

export interface BoardProps {
  xIsNext: boolean;
  squares: Squares;
  onPlay: (squares: Squares) => void;
}
