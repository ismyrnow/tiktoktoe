import Nought from "./Nought";
import PieceButton from "./PieceButton";

interface Props {
  onClick: () => void;
}

export default function NoughtButton({ onClick }: Props) {
  return (
    <PieceButton onClick={onClick}>
      <Nought />
    </PieceButton>
  );
}
