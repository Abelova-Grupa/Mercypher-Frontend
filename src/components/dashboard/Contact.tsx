import { useState, useRef, useEffect } from "react";
import type { Contact } from "../ChatApp";
import NewContact from "./NewContact";

interface ContactProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (username: string) => Promise<void>;
  onUpdate: (contact: { username: string; nickname: string }) => Promise<void>;
}

export function ContactCard({
  contact,
  isSelected,
  onClick,
  onUpdate,
  onDelete,
}: ContactProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showNewContact, setShowNewContact] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isDropDownOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsDropDownOpen(false);
      }

      if (
        showNewContact &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setShowNewContact(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropDownOpen, showNewContact]);

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDropDownOpen(true);
  };

  const handleCloseContact = () => {
    setShowNewContact(false);
  };

  const handleOpenUpdateContact = () => {
    setIsDropDownOpen(false);
    setShowNewContact(true);
  };

  return (
    <li
      onClick={onClick}
      className={`
        w-full flex items-center px-5 py-4 cursor-pointer transition-all 
        ${
          isSelected
            ? "bg-app-border border-r-4 border-primary-active"
            : "hover:bg-app-divider border-r-4 border-transparent"
        }
      `}
    >
      <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-primary to-primary-active flex items-center justify-center text-white font-semibold shadow-sm">
        {contact?.nickname[0].toUpperCase()}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">
            {contact.nickname}
          </p>

          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="p-1 hover:bg-gray-200 rounded-full text-gray-400 group-hover:opacity-100  transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {isDropDownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropDownOpen(false);
                    handleOpenUpdateContact();
                    // onUpdate();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  Edit contact
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropDownOpen(false);
                    onDelete(contact.username);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {showNewContact && (
          <NewContact
            title="Update contact"
            innerRef={popupRef}
            onClose={handleCloseContact}
            onSave={onUpdate}
          />
        )}

        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500 truncate">
            Click to view history
          </p>
          <span className="text-[10px] text-gray-400 font-medium">
            {contact.username}
          </span>
        </div>
      </div>
    </li>
  );
}
