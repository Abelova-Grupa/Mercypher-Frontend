import { useState } from "react";
import type { MessagePayload } from "../../types/websocket-wrappers";
import type { Contact } from "../ChatApp";
import MessageBlob from "./MessageBlob";
interface ChatProps {
  selectedContact: Contact | null;
  photo: string;
  messagesByUser: Record<string, MessagePayload[]>;
  onSend: (message: string) => void;
}

export default function Chat(props: ChatProps): React.ReactElement {
  const [message, setMessage] = useState("");

  const key = props.selectedContact?.username;
  const messages = key ? props.messagesByUser[key] || [] : [];

  const handleSend = () => {
    if (!message.trim()) return;
    props.onSend(message);
    setMessage("");
  };

  return (
    <div className="chat-container">
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
            <img className="h-[24px] w-[24px]" src="/search.svg" alt="search" />
          </button>
          <button className="mr-4">
            <img
              className="h-[28px] w-[28px]"
              src="/three-dots.svg"
              alt="options"
            />
          </button>
        </div>
      </div>
      <div className="chat">
        {messages.map((msg, index) => (
          <div key={index}>
            <MessageBlob
              {...{
                message: msg,
                senderName: msg.sender_id,
                isMe: msg.receiver_id === key ? true : false,
              }}
            />
          </div>
        ))}
      </div>
      <div className="message-bar">
        <div className="message-bar-emoji-btn-container">
          <button className="emoji-btn">
            <img
              className="emoji-btn-img"
              src="/smile-square.svg"
              alt="emoji icon"
            />
          </button>
        </div>
        <div className="message-bar-input-container">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
          />
        </div>
        <div className="message-bar-extra-container">
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
