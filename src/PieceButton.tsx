import "./PieceButton.css";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

export default function PieceButton({ children, onClick }: Props) {
  return (
    <div role="buton" className="piece-button" onClick={onClick}>
      {children}
    </div>
  );
}
