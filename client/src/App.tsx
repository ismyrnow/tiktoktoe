import "./App.css";
import Game from "./Game";

const lastPathSegment = window.location.pathname.split("/").pop();

function App() {
  const initialGameId = lastPathSegment || undefined;

  return (
    <>
      <h1>
        <a href="/">TikTokToe</a>
      </h1>
      <Game initialGameId={initialGameId} />
    </>
  );
}

export default App;
