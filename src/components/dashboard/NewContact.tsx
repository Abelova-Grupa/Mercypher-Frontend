import React, { useState } from "react";

interface NewContactProps {
  innerRef?: React.Ref<HTMLDivElement>;
  onClose?: () => void;
  onSave?: (contact: {
    username: string;
    nickname: string;
  }) => void | Promise<void>;
  title: string;
  initUsername?: string;
  initNickname?: string;
}

export default function NewContact({
  innerRef,
  onClose,
  onSave,
  initUsername = "",
  initNickname = "",
  title,
}: NewContactProps) {
  const [username, setUsername] = useState(initUsername);
  const [nickname, setNickname] = useState(initNickname);

  const handleSave = () => {
    if (username.trim()) {
      onSave?.({ username: username, nickname: nickname });
      console.log("Contact saved:", { username, nickname });
      onClose?.();
    }
  };

  return (
    <div
      className={`new-contact-popup absolute z-50 shadow-xl top-[10px] ${title === "Update contact" ? "left-60" : ""}`}
      ref={innerRef}
    >
      <div className="w-full flex items-center p-4 border-b border-[#ddd8d1]">
        <button
          onClick={onClose}
          className="mr-4 hover:bg-[#e7e4d6] rounded-full p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>

          {/* <img src="/back.svg" className="w-6 h-6" alt="Nazad" /> */}
        </button>
        <p className="text-xl font-semibold">{title}</p>
      </div>

      <div className="flex flex-col items-center my-6">
        <div className="w-24 h-24 bg-[#ddd8d1] rounded-full flex items-center justify-center overflow-hidden">
          <img
            src="/account.svg"
            className="w-16 h-16 opacity-50"
            alt="Avatar"
          />
        </div>
      </div>

      <div className="w-full px-6 flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-[#54ac64] mb-1 ml-1">
            Contact username
          </label>
          <input
            className="searchbar-input border-b-2 border-[#ddd8d1] focus:border-[#54ac64] outline-none bg-transparent px-2 py-1 transition-colors"
            type="text"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[#54ac64] mb-1 ml-1">Nickname</label>
          <input
            className="searchbar-input border-b-2 border-[#ddd8d1] focus:border-[#54ac64] outline-none bg-transparent px-2 py-1 transition-colors"
            type="text"
            placeholder=""
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center pb-6">
        <button
          onClick={handleSave}
          className="bg-[#54ac64] text-white px-8 py-2 rounded-3xl font-bold shadow-md hover:bg-[#54ac64] transition-all active:scale-95"
        >
          Save Contact
        </button>
      </div>
    </div>
  );
}
