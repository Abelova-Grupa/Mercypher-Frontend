// import { useState } from "react";

export default function EmailCodeForm(): React.ReactElement {
  //   const [code, setCode] = useState<string>("");

  const handleCellInput = (id: number) => {
    if (id == 6) id = 0;
    const cur_cell = `cell-${id}`;
    const next_cell = `cell-${id + 1}`;
    document.getElementById(cur_cell)?.blur();
    document.getElementById(next_cell)?.focus();
  };

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
        <input
          type="text"
          id="code-1"
          className="code-cell"
          maxLength={1}
          onChange={() => handleCellInput(1)}
        />
        <input
          type="text"
          id="code-2"
          className="code-cell"
          maxLength={1}
          onChange={() => handleCellInput(2)}
        />
        <input
          type="text"
          id="code-3"
          className="code-cell"
          maxLength={1}
          onChange={() => handleCellInput(3)}
        />
        <input
          type="text"
          id="code-4"
          className="code-cell"
          maxLength={1}
          onChange={() => handleCellInput(4)}
        />
        <input
          type="text"
          id="code-5"
          className="code-cell"
          maxLength={1}
          onChange={() => handleCellInput(5)}
        />
        <input
          type="text"
          id="code-6"
          className="code-cell"
          maxLength={1}
          onChange={() => handleCellInput(6)}
        />
      </div>
      <button className="forgot-button">Check code</button>
    </div>
  );
}
