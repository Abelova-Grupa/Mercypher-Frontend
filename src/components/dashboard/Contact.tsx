interface ContactProps {
  username: string;
  isSelected: boolean;
  onClick: () => void;
}

export function Contact({ username, isSelected, onClick }: ContactProps) {
return (
    <li 
      onClick={onClick}
      className={`
        w-full flex items-center px-5 py-4 cursor-pointer transition-all
        ${isSelected 
          ? 'bg-blue-50 border-r-4 border-blue-600' 
          : 'hover:bg-gray-50 border-r-4 border-transparent'}
      `}
    >
      <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
        {username[0].toUpperCase()}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">
            {username}
          </p>
          <span className="text-[10px] text-gray-400 font-medium">12:45 PM</span>
        </div>
        <p className="text-xs text-gray-500 truncate mt-1">
          Tap to view message history
        </p>
      </div>
    </li>
  );
}
