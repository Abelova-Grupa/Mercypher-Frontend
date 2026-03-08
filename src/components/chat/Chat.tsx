import { useEffect, useRef, useState } from "react";
import type { MessagePayload } from "../../types/websocket-wrappers";
import type { Contact } from "../ChatApp";
import MessageBlob from "./MessageBlob";
import MessageBar from "./MessageBar";
import NewContact from "../dashboard/NewContact";
interface ChatProps {
  selectedContact: Contact | null;
  me: string;
  photo: string;
  messagesByUser: Record<string, MessagePayload[]>;
  onSend: (message: string) => void;
  onLoadMore: (activeUser: Contact, isLoadMore: boolean) => void;
  onDelete: (username: string) => Promise<void>;
  onUpdate: (contact: { username: string; nickname: string }) => Promise<void>;
}

export default function Chat(props: ChatProps): React.ReactElement {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");

  const key = props.selectedContact?.username;
  const messages = key ? props.messagesByUser[key] || [] : [];

  const handleSend = () => {
    if (!message.trim()) return;
    props.onSend(message);
    setMessage("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container && container.scrollTop === 0 && props.selectedContact) {
      // Trigger the load more from props
      props.onLoadMore(props.selectedContact, true);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // (scrollHeight - scrollTop is the total height minus how much we've scrolled)
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150;

    // 1. If we are near the bottom, scroll to see the NEW message
    // 2. If this is the initial load (exactly 20 messages), scroll to bottom
    if (isAtBottom || messages.length === 20) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // code for 3 dots button
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showNewContact, setShowNewContact] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDropDownOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsDropDownOpen(false);
      }
      if (showNewContact && popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowNewContact(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropDownOpen, showNewContact]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropDownOpen(!isDropDownOpen);
  };
  //

  if (!props.selectedContact) {
    return (
      <div className="chat-container flex items-center justify-center">
        <div className="bg-white/90 px-8 py-4 rounded-full shadow-lg transform transition-all">
          <p className="text-black font-medium text-center">
            Select one of your contacts to start messaging!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container flex flex-col h-screen max-h-screen w-full overflow-hidden">
      <div className="chat-info-container">
        <div className="flex">
          <div>
            <img
              className="h-[48px] w-[48px] rounded-4xl ml-4"
              src={props.photo}
              alt="contact photo"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-black leading-tight">{props.selectedContact?.nickname}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-black">@{props.selectedContact?.username}</p>
          </div>
        </div>
        <div className="flex items-center relative" ref={menuRef}>
  <button
    onClick={toggleMenu}
    className="p-1 hover:bg-gray-200 rounded-full text-gray-400 mr-4 transition-all cursor-pointer"
  >
    <img className="h-[28px] w-[28px]" src="/three-dots.svg" alt="options" />
  </button>

  {isDropDownOpen && (
    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden z-[60]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDropDownOpen(false);
          setShowNewContact(true);
        }}
        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        Edit contact
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDropDownOpen(false);
          if (props.selectedContact) props.onDelete(props.selectedContact.username);
        }}
        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        Delete
      </button>
    </div>
  )}
</div>

{/* The Modal / Popup */}
{showNewContact && props.selectedContact && (
  <div className="fixed top-0 left-0 w-[100vw] h-[100vh] z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
    <div onClick={(e) => e.stopPropagation()}>
      <NewContact
        title="Update contact"
        innerRef={popupRef}
        onClose={() => setShowNewContact(false)}
        onSave={props.onUpdate}
        initUsername={props.selectedContact.username} 
        initNickname={props.selectedContact.nickname}
      />
    </div>
  </div>
)}
      </div>
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="chat flex-1 overflow-y-auto p-4 anchor-none"
      >
        {messages.map((msg, index) => (
          <div key={`${msg.sender_id}-${index}`}>
            <MessageBlob
              message={msg}
              senderName={msg.sender_id}
              isMe={msg.sender_id === props.me}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageBar
        value={message}
        onChange={setMessage}
        onSend={handleSend}
      />
    </div>
  );
}