import "./App.css";
import Game from "./Game";
import useUserService from "./user-service/useUserService";

const firstPathSegment = window.location.pathname.split("/")[1];

function App() {
  const { isSignedIn, loading } = useUserService();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && !isSignedIn) {
    return <p>Failed to sign in</p>;
  }

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <Game initialGameId={firstPathSegment} />
    </>
  );
}

export default App;
