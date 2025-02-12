import Cross from "./Cross";
import PieceButton from "./PieceButton";

interface Props {
  onClick: () => void;
}

export default function CrossButton({ onClick }: Props) {
  return (
    <PieceButton onClick={onClick}>
      <Cross />
    </PieceButton>
  );
}
