import React from "react";
import type { MessagePayload } from "../../types/websocket-wrappers";

interface MessageBlobProps {
  message: MessagePayload;
  senderName: string | undefined;
  isMe?: boolean;
}

const MessageBlob: React.FC<MessageBlobProps> = ({ message, senderName, isMe = false }) => {
  const formatTime = (ts: any) => {
    if (!ts) return "13:12";
    const n = Number(ts);
    // If it's seconds (10 digits), multiply by 1000 for JS
    const date = n < 10000000000 ? new Date(n * 1000) : new Date(n);
    return date.getHours() + ":" + String(date.getMinutes()).padStart(2, '0');
  };
  const decodeBase64 = (str: string) => {
    try {
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      // Fallback if the message wasn't base64 (like old history)
      return str;
    }
  };
  return (
    <div className={`flex flex-col mb-2 w-full ${isMe ? "items-end pr-5" : "items-start pl-5"}`}>
      {!isMe && senderName && <span className="text-[10px] font-bold uppercase text-black-200 mb-0.5">{senderName}</span>}
      <div className={`max-w-[85%] px-3 py-2 shadow-sm border ${isMe ? "bg-[#ddd8d1] rounded-2xl rounded-tr-none border-[#ccc7c0]" : "bg-[#f2eee6] rounded-2xl rounded-tl-none border-[#ddd8d1]"
        }`}>
        <p className="text-[14px] leading-snug break-words">{decodeBase64(message.body)}</p>
        <div className="flex justify-end mt-1">
          <span className="text-[9px] opacity-40 font-medium">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBlob;