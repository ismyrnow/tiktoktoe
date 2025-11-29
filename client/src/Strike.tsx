import "./Strike.css";
import { Piece } from "./game-service/GameServiceTypes";

interface Props {
  combination: number[];
  piece: Piece;
}

export default function Strike({ combination, piece }: Props) {
  const comboKey = combination.join("");
  const color = piece === "x" ? "#EE1D52" : "#69C9D0";

  return (
    <div className="strike-container">
      <div 
        className={`strike strike-${comboKey}`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
