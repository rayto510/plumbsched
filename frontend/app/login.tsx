import { useRouter } from "expo-router";
import LoginScreen from "../components/ui/LoginScreen";

export default function Login() {
  const router = useRouter();

  const handleLogin = (email: string, password: string) => {
    // Normally you'd verify credentials here
    console.log("Logged in:", email);
    router.replace("/"); // Navigate to home screen
  };

  return <LoginScreen onLogin={handleLogin} />;
}
