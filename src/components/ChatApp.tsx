import type React from "react";
import Chat from "./chat/Chat";
import Dashboard from "./dashboard/Dashboard";
import InfoPanel from "./info/InfoPanel";
import { useEffect, useRef, useState } from "react";
import { ContactService } from "../services/ContactService";
import type { MessagePayload } from "../types/websocket-wrappers";
import { AuthService } from "../services/AuthService";

export type Contact = {
  username: string;
  nickname: string;
};

export default function ChatApp(): React.ReactElement {
  const wsRef = useRef<WebSocket | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeUser, setActiveUser] = useState<Contact | null>(null);
  const [messagesByUser, setMessagesByUser] = useState<
    Record<string, MessagePayload[]>
  >({});
  const [me, setMe] = useState("");

  // TODO: AA

  useEffect(() => {
    AuthService.me().then((m) => {
      setMe(m.message);
    });
  }, []);

  useEffect(() => {
    if (!me) return; // wait until user is loaded

    // Contacts
    ContactService.fetchContacts().then((c) => setContacts(c.contacts));

    // WebSocket init
    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => console.log("Connected");
    ws.onmessage = (event) => {
      const envelope = JSON.parse(event.data);
      if (envelope.type === "message" || envelope.type === "message_ack") {
        handleIncomingMessage(envelope.data);
      }
    };
    ws.onclose = () => console.log("Disconnected");
    wsRef.current = ws;

    return () => ws.close();
  }, [me]);

  const sendMessage = (messageText: string) => {
    if (!wsRef.current || !activeUser || !me) return;

    const msg: MessagePayload = {
      sender_id: me,
      receiver_id: activeUser.username,
      body: messageText,
    };

    wsRef.current.send(JSON.stringify({ type: "message", data: msg }));

    // optional: optimistic update
    // handleIncomingMessage(msg)
  };

  const handleIncomingMessage = (msg: MessagePayload) => {
    const conversationId =
      msg.sender_id === me ? msg.receiver_id : msg.sender_id;

    if (!conversationId) return;

    setMessagesByUser((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), msg],
    }));
  };

  console.log(contacts);

  if (!me) return <div>Loading</div>;
  else
    return (
      <div className="root-chat-container">
        <Dashboard
          contacts={contacts}
          selectedUser={activeUser}
          onSelect={setActiveUser}
          onSetContacts={setContacts}
        />
        <Chat
          selectedContact={activeUser}
          photo="/abelovci.png"
          messagesByUser={messagesByUser}
          onSend={sendMessage}
        />
        <InfoPanel />
      </div>
    );
}
