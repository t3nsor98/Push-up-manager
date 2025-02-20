import { useState } from "react";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";

const Auth = ({ setUser }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setLoading(false);
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      {!auth.currentUser ? (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login with Google"}
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Auth;
