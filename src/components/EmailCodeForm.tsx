import { useRef } from "react";
import CodeInputField from "./CodeInput";
import { Navigate, useLocation, useNavigate } from "react-router";
import { AuthService } from "../services/AuthService";

export default function EmailCodeForm(): React.ReactElement {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  const isNum = (codeBit: string) => {
    return !isNaN(parseInt(codeBit.trim()));
  };

  const handleCellInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    const codeBit = e.target.value;
    if (isNum(codeBit)) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handleCodeSend = () => {
    const code = inputsRef.current.reduce((acc, input) => {
      return acc + (input?.value || "");
    }, "");

    if (code.length !== 5) {
      return;
    }

    try {
      AuthService.verifyEmailCode(username, code);
      navigate("/login");
    } catch (error) {
      console.error("Invalid auth code: " + error);
    }
  };

  if (!location.state?.username) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="login-container">
      <div className="h-[50%]">
        <img
          src="/doodle-mailbox.png"
          className="w-[300px] h-[300px]"
          alt="alert-icon"
        />
      </div>
      <div className="w-[80%] mb-2 pl-2 text-xl font-semibold text-left">
        <p>Enter your confirmation code</p>
      </div>
      <div className="code-div">
        {[0, 1, 2, 3, 4].map((i) => (
          <CodeInputField
            index={i}
            key={i}
            inputRef={(el) => (inputsRef.current[i] = el)}
            handleBackSpacePress={handleKeyDown}
            handleCellInput={handleCellInput}
          />
        ))}
      </div>
      <button className="forgot-button" onClick={handleCodeSend}>
        Check code
      </button>
    </div>
  );
}
