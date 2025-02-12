import Cross from "./Cross";
import Nought from "./Nought";
import { Piece } from "./game-service/GameServiceTypes";
import "./Player.css";

interface Props {
  active: boolean;
  name: string;
  piece: Piece;
}

export default function Player({ active, name, piece }: Props) {
  const className = active ? "player active" : "player";
  return (
    <div className={className}>
      <div>
        <span className="name">{name}</span>
        <span className="piece">{piece === "x" ? <Cross /> : <Nought />}</span>
      </div>
      <div>
        <img
          className="avatar"
          src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${piece}&backgroundColor=transparent`}
          alt={name}
        />
      </div>
    </div>
  );
}
