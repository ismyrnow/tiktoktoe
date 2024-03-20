import "./App.css";
import Game from "./Game";

const firstPathSegment = window.location.pathname.split("/")[1];

function App() {
  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <Game initialGameId={firstPathSegment} />
    </>
  );
}

export default App;
