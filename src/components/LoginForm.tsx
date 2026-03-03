import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { AuthService } from "../services/AuthService";

export default function LoginForm(): React.ReactElement {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault(); // Prevents page reload on form submit
    if (!username || !password || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.login(username, password);
      const user = await AuthService.me();

      console.log("Logged in as:", user.message);
      navigate("/chat", { replace: true });
    } catch (err) {
      setError("Invalid username or password. Please try again.");
      console.error("Login failed: " + err);
    } finally {
      setIsLoading(false);
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
      <p className="login-subtitle">The fastest way to private conversations</p>

      {/*  iWrappingn a form enables 'Enter' key submission */}
      <form onSubmit={handleLogin} className="login-input-wrapper">
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <input
          className="login-input mt-6"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <div className="forgot-password">
          <button type="button" onClick={handleForgotPassword}>
            Forgot password?
          </button>
        </div>

        <button 
          className="login-button" 
          type="submit" 
          disabled={isLoading || !username || !password}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="login-footer">
        <span className="mr-2">Don't have an account?</span>
        <button className="signup-button" onClick={handleSignUp}>
          Sign up
        </button>
      </div>
    </div>
  );
}