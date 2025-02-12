import "./Strike.css";

interface Props {
  combination: number[];
}

export default function Strike({ combination }: Props) {
  const comboKey = combination.join("");

  return (
    <div className="strike-container">
      <div className={`strike strike-${comboKey}`} />
    </div>
  );
}
