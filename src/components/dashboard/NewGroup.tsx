import React, { useState } from "react";
import type { Contact } from "../ChatApp";

interface NewGroupProps {
  innerRef?: React.Ref<HTMLDivElement>;
  onClose?: () => void;
  onSave?: (groupData: {
    groupName: string;
    members: string[];
  }) => void | Promise<void>;
  contacts: Contact[];
  title: string;
  initGroupName?: string;
  initMembers?: string[];
}

export default function NewGroup({
  innerRef,
  onClose,
  onSave,
  contacts,
  title,
  initGroupName = "",
  initMembers = [],
}: NewGroupProps) {
  const [groupName, setGroupName] = useState(initGroupName);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(initMembers);

  const toggleMember = (username: string) => {
    setSelectedMembers((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const handleSave = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onSave?.({ groupName: groupName, members: selectedMembers });
      onClose?.();
    }
  };

  return (
    <div
      className="new-contact-popup absolute z-50 shadow-xl top-[10px] bg-[#fdfcf3] rounded-lg overflow-hidden"
      ref={innerRef}
    >
      <div className="w-full flex items-center p-4 border-b border-[#ddd8d1]">
        <button
          onClick={onClose}
          className="mr-4 hover:bg-[#e7e4d6] rounded-full p-1 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </button>
        <p className="text-xl font-semibold">{title}</p>
      </div>
      <div className="flex flex-col items-center my-6">
        <div className="w-20 h-20 bg-[#ddd8d1] rounded-full flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center my-6">
            <div className="w-24 h-24 bg-[#ddd8d1] rounded-full flex items-center justify-center overflow-hidden relative">
              <img
                src="/account.svg"
                className="w-14 h-14 opacity-63 absolute top-5 left-3"
                alt="Avatar Background"
                style={{ transform: 'scale(0.96)' }} 
              />
              <img
                src="/account.svg"
                className="w-16 h-16 opacity-60 absolute top-4 right-3 z-10"
                alt="Avatar Foreground"
              />

            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-6 flex flex-col gap-6">
        <div className="flex flex-col">
          <label className="text-sm text-[#54ac64] mb-1 ml-1 font-medium">
            Group Name
          </label>
          <input
            className="searchbar-input border-b-2 border-[#ddd8d1] focus:border-[#54ac64] outline-none bg-transparent px-2 py-1 transition-colors"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-[#54ac64] mb-2 ml-1 font-medium">
            Select Members ({selectedMembers.length})
          </label>
          <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {contacts.map((contact) => {
              const isSelected = selectedMembers.includes(contact.username);
              return (
                <div
                  key={contact.username}
                  onClick={() => toggleMember(contact.username)}
                  className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer transition-all border ${isSelected
                    ? "bg-[#54ac64]/10 border-[#54ac64]"
                    : "bg-white border-transparent hover:bg-[#e7e4d6]"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${isSelected ? "bg-[#54ac64] text-white" : "bg-[#ddd8d1] text-gray-600"
                    }`}>
                    {contact.nickname[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{contact.nickname}</p>
                    <p className="text-[10px] text-gray-500">@{contact.username}</p>
                  </div>
                  {isSelected && (
                    <div className="text-[#54ac64]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center pb-6">
        <button
          onClick={handleSave}
          disabled={!groupName.trim() || selectedMembers.length === 0}
          className={`px-10 py-2 rounded-3xl font-bold shadow-md transition-all active:scale-95 ${groupName.trim() && selectedMembers.length > 0
            ? "bg-[#54ac64] text-white hover:opacity-90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {title === "Update group" ? "Save Changes" : "Create Group"}
        </button>
      </div>
    </div>
  );
}