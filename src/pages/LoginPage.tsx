import { AuthForm } from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import { signIn } from "../lib/firebase"; // Import the helper we made
import { updateProfile } from "firebase/auth";

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (name: string) => {
    try {
        // 1. Sign in to Firebase anonymously
        const user = await signIn();
        
        // 2. Save the name to their profile
        await updateProfile(user, {
            displayName: name
        });
        
        console.log("Logged in as:", name);
        
        // 3. Go to Lobby
        navigate('/lobby');
    } catch (error) {
        console.error("Login failed:", error);
        alert("Could not connect to authentication server.");
    }
  };

  return (
    <div className="relative w-full h-screen">
      <AuthForm onLogin={handleLogin} />
    </div>
  );
};