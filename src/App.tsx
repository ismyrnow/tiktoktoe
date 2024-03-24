import "./App.css";
import Game from "./Game";
import useUserService from "./user-service/useUserService";

const lastPathSegment = window.location.pathname.split("/").pop();

function App() {
  const { isSignedIn, loading } = useUserService();
  let initialGameId = lastPathSegment;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && !isSignedIn) {
    return <p>Failed to sign in</p>;
  }

  if (lastPathSegment === "tiktoktoe") {
    initialGameId = undefined;
  }

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <Game initialGameId={initialGameId} />
    </>
  );
}

export default App;
