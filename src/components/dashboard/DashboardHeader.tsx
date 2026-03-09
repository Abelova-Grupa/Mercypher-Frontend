import { useEffect, useRef, useState } from "react";
import NewContact from "./NewContact";
import NewGroup from "./NewGroup";
import type { Contact } from "../ChatApp";

interface HeaderProps {
  contacts: Contact[];
  onSave: (contact: { username: string; nickname: string }) => Promise<void>;
  onGroupSave: (groupData: { groupName: string; members: string[] }) => Promise<void>;
}

export default function DashboardHeader({ contacts, onSave, onGroupSave }: HeaderProps) {
  const [showNewContact, setShowNewContact] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleNewContact = () => {
    setShowNewContact((showNewContact) => !showNewContact);
  };

  const handleCloseContact = () => {
    setShowNewContact(false);
  };

  const [showNewGroup, setShowNewGroup] = useState<boolean>(false);
  const groupPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // Check Contact Popup
      if (popupRef.current && !popupRef.current.contains(target) && btnRef.current && !btnRef.current.contains(target)) {
        setShowNewContact(false);
      }

      // Check Group Popup
      if (groupPopupRef.current && !groupPopupRef.current.contains(target)) {
        setShowNewGroup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNewContact, showNewGroup]);

  return (
    <div className="dashboard-header">
      <div className="dashboard-title">
        <img
          className="header-img"
          src="/mercury_head_logo.png"
          alt="mercypher logo"
        />
        <h1 className="header-title">Mercypher</h1>
      </div>
      <div className="w-2"></div>
      <div className="w-2"></div>

      <div className="dashboard-btns">
        <button
          onClick={() => setShowNewGroup(true)}
          className="new-chat-btn p-1.5 bg-primary hover:bg-primary-active rounded-md transition-all flex items-center justify-center shadow-sm"
          title="Create Group"
        >
          <svg
            className="add-header-btn"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '20px', height: '20px' }}
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </button>
        <div className="w-2"></div>
        <button
          ref={btnRef}
          onClick={handleNewContact}
          className="p-1.5 bg-primary hover:bg-primary-active rounded-md transition-all flex items-center justify-center shadow-sm"
          title="Add Contact"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '20px', height: '20px' }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        {showNewContact && (
          <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/20 backdrop-blur-[0.5px] flex justify-start items-start p-10">
          <NewContact
            title="Create contact"
            innerRef={popupRef}
            onClose={handleCloseContact}
            onSave={onSave}
          />
          </div>
        )}
        {showNewGroup && (
          <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/20 backdrop-blur-[0.5px] flex justify-start items-start p-10">
            <div onClick={(e) => e.stopPropagation()}>
              <NewGroup
                title="Create Group"
                innerRef={groupPopupRef}
                contacts={contacts}
                onClose={() => setShowNewGroup(false)}
                onSave={onGroupSave}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
