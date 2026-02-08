import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthService } from "../services/AuthService";

export default function LoginForm(): React.ReactElement {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    if (!username || !password) return;

    try {
      await AuthService.login(username, password);
      const user = await AuthService.me();

      console.log("Logged in as:", user.message);
      navigate("/chat", { replace: true });
    } catch (error) {
      console.error("Login failed: " + error);
    }
  };

  const handleSignUp = (): void => {
    navigate("/register");
  };

  const handleForgotPassword = (): void => {
    navigate("/forgot");
  };

  return (
    <div className="login-container">
      <img
        className="w-[100px] h-[100px] mx-auto mt-2"
        src="/mercury_head_logo.png"
        alt="mercypher-logo"
      />
      <h1 className="login-heading">Mercypher</h1>
      <h3 className="mt-4 login-subtitle">Welcome to Mercypher</h3>
      <h3 className="login-subtitle">
        The fastest way to private conversations
      </h3>
      <div className="login-input-wrapper">
        <input
          className="login-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input mt-6"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="forgot-password">
        <button onClick={handleForgotPassword}>Forgot password?</button>
      </div>

      <button className="login-button" onClick={handleLogin}>
        Log in
      </button>
      <div className="login-footer">
        <span className="mr-2">Don't have an account?</span>
        <button className="signup-button" onClick={handleSignUp}>
          Sign up
        </button>
      </div>
      <div></div>
    </div>
  );
}
