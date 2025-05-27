import { useRouter } from "expo-router";
import RegisterScreen from "../components/ui/RegisterScreen";

export default function RegisterPage() {
  const router = useRouter();

  const onRegisterSuccess = () => {
    // After registration, navigate to login page
    router.replace("/login");
  };

  return <RegisterScreen onRegisterSuccess={onRegisterSuccess} />;
}
