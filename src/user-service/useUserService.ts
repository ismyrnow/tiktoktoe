import { useEffect, useState } from "react";
import userService from "./SupabaseUserService";

// Use an init flag because react wants to call our useEffect twice in strict mode.
// See https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let hasStartedInit = false;

export default function useGameService() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasStartedInit) {
      return;
    }

    hasStartedInit = true;

    (async function () {
      setLoading(true);
      try {
        const session = await userService.getSession();

        if (!session) {
          await userService.signInAnonymously();
        }

        setIsSignedIn(true);
      } catch (error) {
        console.error("Failed to sign in anonymously", error);
      }
      setLoading(false);
    })();
  }, []);

  return {
    isSignedIn,
    loading,
  };
}
