import "./App.css";
import Game from "./Game";
import useUserService from "./user-service/useUserService";

const lastPathSegment = window.location.pathname.split("/").pop();

function App() {
  const { isSignedIn, loading } = useUserService();
  const initialGameId = lastPathSegment || undefined;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && !isSignedIn) {
    return <p>Failed to sign in</p>;
  }
  return (
    <>
      <h1>TikTokToe</h1>
      <Game initialGameId={initialGameId} />
    </>
  );
}

export default App;
