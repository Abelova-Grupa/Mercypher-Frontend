import type React from "react";
import Chat from "./chat/Chat";
import Dashboard from "./dashboard/Dashboard";
import InfoPanel from "./info/InfoPanel";
import { useEffect, useRef, useState } from "react";
import { ContactService } from "../services/ContactService";
import type { MessagePayload } from "../types/websocket-wrappers";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router";

export type Contact = {
  username: string;
  nickname: string;
};

export default function ChatApp(): React.ReactElement {
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeUser, setActiveUser] = useState<Contact | null>(null);
  const [messagesByUser, setMessagesByUser] = useState<
    Record<string, MessagePayload[]>
  >({});
  const [me, setMe] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // TODO: AA

useEffect(() => {
    setIsLoading(true);
    AuthService.me()
      .then((m) => {
        setMe(m.message);
      })
      .catch(() => {
        // Redirect to login if the user session is invalid
        navigate("/login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

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
    

    return () => {
      ws.close();
      wsRef.current = null;
    }
  }, [me]);

  const sendMessage = (messageText: string) => {
    if (!wsRef.current || !activeUser || !me || wsRef.current.readyState !== WebSocket.OPEN) return;

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
    const conversationId = msg.sender_id === me ? msg.receiver_id : msg.sender_id;

    if (!conversationId) return;

    setMessagesByUser((prev) => {
      const existingMessages = prev[conversationId] || [];
      
      return {
        ...prev,
        [conversationId]: [...existingMessages, msg],
      };
    });
  };

  // console.log(contacts); zasto brate

  // 1. We are still checking the session
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Establishing secure connection...</p>
      </div>
    );
  }

  // 2. We finished loading, but 'me' is empty (Auth failed)
  if (!me) {
    return (
      <div className="error-container">
        <h2>Session Expired</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  // 3. User is authorized
  return (
    <div className="root-chat-container">
      <Dashboard
        contacts={contacts}
        selectedUser={activeUser}
        onSelect={setActiveUser}
        onSetContacts={setContacts}
      />
      <Chat
        me={me}
        selectedContact={activeUser}
        photo="/abelovci.png"
        messagesByUser={messagesByUser}
        onSend={sendMessage}
      />
      {/* ovaj infopanel je visak? */}
      <InfoPanel />
    </div>
  );
}
