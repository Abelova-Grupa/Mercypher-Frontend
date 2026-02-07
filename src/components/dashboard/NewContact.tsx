import React, { useState } from "react";

interface NewContactProps {
  innerRef?: React.Ref<HTMLDivElement>;
  onClose?: () => void;
  onSave?: (contact: { username: string; nickname: string }) => void;
}

export default function NewContact({
  innerRef,
  onClose,
  onSave,
}: NewContactProps) {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSave = () => {
    if (username.trim()) {
      onSave?.({ username: username, nickname: nickname });
      console.log("Kontakt sačuvan:", { username, nickname });
      onClose?.();
    }
  };

  return (
    <div
      className="new-contact-popup absolute z-50 shadow-xl top-[10px]"
      ref={innerRef}
    >
      <div className="w-full flex items-center p-4 border-b border-[#ddd8d1]">
        <button
          onClick={onClose}
          className="mr-4 hover:bg-[#e7e4d6] rounded-full p-1"
        >
          <img src="/back.svg" className="w-6 h-6" alt="Nazad" />
        </button>
        <p className="text-xl font-semibold">Novi kontakt</p>
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
          <label className="text-sm text-[#008069] mb-1 ml-1">
            Korisničko ime
          </label>
          <input
            className="searchbar-input border-b-2 border-[#ddd8d1] focus:border-[#008069] outline-none bg-transparent px-2 py-1 transition-colors"
            type="text"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[#008069] mb-1 ml-1">Nadimak</label>
          <input
            className="searchbar-input border-b-2 border-[#ddd8d1] focus:border-[#008069] outline-none bg-transparent px-2 py-1 transition-colors"
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
          className="bg-[#00a884] text-white px-8 py-2 rounded-3xl font-bold shadow-md hover:bg-[#008f71] transition-all active:scale-95"
        >
          SAČUVAJ KONTAKT
        </button>
      </div>
    </div>
  );
}
