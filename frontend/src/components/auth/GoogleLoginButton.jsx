import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const GoogleLoginButton = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const { credential } = credentialResponse;
        try {
          const result = await loginWithGoogle(credential);
          if (result.success) {
            navigate("/dashboard");
          } else {
            toast.error(result.message || "Google login failed");
          }
        } catch (err) {
          toast.error("Google login failed");
        }
      }}
      onError={() => {
        toast.error("Google Login Failed");
      }}
    />
  );
};

export default GoogleLoginButton;
