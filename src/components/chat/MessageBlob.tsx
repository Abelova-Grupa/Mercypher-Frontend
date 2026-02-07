import React from "react";
import type { MessagePayload } from "../../types/websocket-wrappers";

interface MessageBlobProps {
  message: MessagePayload;
  senderName: string | undefined;
  isMe?: boolean;
}

const MessageBlob: React.FC<MessageBlobProps> = ({
  message,
  senderName,
  isMe = false,
}) => {
  return (
    <div
      className={`flex flex-col mb-4 w-full items-end ${isMe ? "items-end pr-5" : "items-start pl-5"}`}
    >
      <span className="text-xs font-semibold text-gray-500 mb-1 px-2">
        {senderName}
      </span>

      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm border  ${
          isMe
            ? "bg-[#ddd8d1] text-gray-800 rounded-tr-none border-[#ccc7c0] "
            : "bg-[#f2eee6] text-gray-800 rounded-tl-none border-[#ddd8d1] "
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.body}</p>
      </div>
    </div>
  );
};

export default MessageBlob;
