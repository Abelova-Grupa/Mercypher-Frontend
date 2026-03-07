import { useEffect, useRef, useState } from "react";
import type { MessagePayload } from "../../types/websocket-wrappers";
import type { Contact } from "../ChatApp";
import MessageBlob from "./MessageBlob";
import MessageBar from "./MessageBar";
interface ChatProps {
  selectedContact: Contact | null;
  me: string;
  photo: string;
  messagesByUser: Record<string, MessagePayload[]>;
  onSend: (message: string) => void;
  onLoadMore: (activeUser: Contact, isLoadMore: boolean) => void;
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
  }}, [messages]);

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
            <h2>{props.selectedContact?.nickname}</h2>
            <p>{props.selectedContact?.username}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button className="mr-4">
            <img className="h-[28px] w-[28px]" src="/three-dots.svg" alt="options" />
          </button>
        </div>
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