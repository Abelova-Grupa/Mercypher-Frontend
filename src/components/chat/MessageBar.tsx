interface MessageBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export default function MessageBar({ value, onChange, onSend }: MessageBarProps) {
  return (
    <div className="flex items-end gap-3 p-2 bg-white border-t border-[#ddd8d1] w-full">
      {/* Emoji Button */}
      <div className="flex items-center mb-1">
        <button className="p-2 hover:bg-[#f2eee6] rounded-full transition-colors">
          <img className="w-6 h-6 opacity-60" src="/smile-square.svg" alt="emoji" />
        </button>
      </div>

      {/* Modernized Input Container */}
      <div className="flex-1 bg-[#f2eee6] rounded-2xl px-4 py-2 flex items-center shadow-inner">
        <input
          className="w-full bg-transparent outline-none text-sm py-1 placeholder:text-gray-400"
          type="text"
          placeholder="Write a message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button className="ml-2 opacity-40 hover:opacity-100 transition-opacity">
          <img className="w-5 h-5" src="/file-plus.svg" alt="attach" />
        </button>
      </div>

      {/* Send Button - Only shows color when text is present */}
      <div className="flex items-center mb-1">
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className={`p-2 rounded-full transition-all ${
            value.trim() 
              ? "bg-[#54ac64] text-white scale-100 shadow-md" 
              : "bg-gray-200 text-gray-400 scale-90 cursor-not-allowed"
          }`}
        >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
        </button>
      </div>
    </div>
  );
}