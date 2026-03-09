import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

export default function RegisterForm(): React.ReactElement {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Basic validation logic
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const url = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/register`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      navigate("/code", { state: { username } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-image">
        <img className="w-[450px] h-[450px]" src="/planet.png" alt="globe" />
      </div>

      {/* Changed to form for Enter-key support */}
      <form onSubmit={handleRegister} className="register-input-container">
        <h1 className="register-title">Sign up to Mercypher</h1>

        <div className="register-subtitle mb-1"><p>Username</p></div>
        <input
          className="register-input"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="register-subtitle mb-1"><p>Email</p></div>
        <input
          className="register-input"
          name="email"
          type="email" 
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="register-subtitle mb-1"><p>Password</p></div>
        <input
          className="register-input"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="register-subtitle mb-1"><p>Confirm password</p></div>
        <input
          className="register-input"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button 
          className="register-button" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}