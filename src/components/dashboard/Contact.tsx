import type { Contact } from "../ChatApp";

interface ContactProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}

export function ContactCard({ contact, isSelected, onClick }: ContactProps) {
return (
    <li 
      onClick={onClick}
      className={`
        w-full flex items-center px-5 py-4 cursor-pointer transition-all 
        ${isSelected 
          ? 'bg-app-border border-r-4 border-primary-active' 
          : 'hover:bg-app-divider border-r-4 border-transparent'}
      `}
    >
      <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-primary to-primary-active flex items-center justify-center text-white font-semibold shadow-sm">
        {contact.nickname[0].toUpperCase()}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">
            {contact.nickname}
          </p>
          <span className="text-[10px] text-gray-400 font-medium">{contact.username}</span>
        </div>
        
        <p className="text-xs text-gray-500 truncate mt-1">
          Click to view message history
        </p>
      </div>
    </li>
  );
}
