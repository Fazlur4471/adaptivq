
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useLocation } from "react-router-dom";

const GoogleSignIn = () => {
  const { signInWithGoogle } = useAuth();
  const location = useLocation();
  
  const handleGoogleSignIn = async () => {
    const from = location.state?.from || '/dashboard';
    await signInWithGoogle(from);
  };

  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center gap-2 mt-4"
      onClick={handleGoogleSignIn}
    >
      <FcGoogle className="h-5 w-5" />
      Continue with Google
    </Button>
  );
};

export default GoogleSignIn;
