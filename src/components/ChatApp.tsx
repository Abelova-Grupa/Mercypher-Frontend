import type React from "react";
import Chat from "./chat/Chat";
import Dashboard from "./dashboard/Dashboard";
import InfoPanel from "./info/InfoPanel";
import { useEffect, useRef, useState } from "react";
import { ContactService } from "../services/ContactService";
import type { MessagePayload } from "../types/websocket-wrappers";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router";
import { GroupService, type Group } from "../services/GroupService";

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
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(true);

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

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoadingGroups(true);
        const res = await GroupService.fetchUserGroups();
        setGroups(res.groups);
      } catch (err) {
        console.error("Failed to load user groups:", err);
      } finally {
        setIsLoadingGroups(false);
      }
    };

    loadGroups();
  }, []);
  // loading messages for the selected contact
  useEffect(() => {
    if (activeUser && !messagesByUser[activeUser.username]) {
      fetchHistory(activeUser.username);
    }
  }, [activeUser]);

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

  const fetchHistory = async (contactUsername: string, isLoadMore = false) => {
    const currentMessages = messagesByUser[contactUsername] || [];

    // If loading more, use the timestamp of the OLDEST message we have.
    // Otherwise, use "now" to get the most recent 20.
    const lastSeen = isLoadMore && currentMessages.length > 0
      ? currentMessages[0].timestamp
      : Math.floor(Date.now() / 1000);

    try {
      const res = await fetch("http://localhost:8080/loadMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          contact: contactUsername,
          limit: 20,
          lastSeen: lastSeen
        }),
      });
      const data = await res.json();
      const history = [...data.messages].reverse(); // Array of MessagePayload

      setMessagesByUser((prev) => {
        const existing = prev[contactUsername] || [];
        return {
          ...prev,
          // add old messages to the start of the array
          [contactUsername]: isLoadMore ? [...history, ...existing] : history,
        };
      });
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
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

  const handleContactDelete = async (username: string) => {
    if (!username) return;
    try {
      await ContactService.deleteContact(username);
      setContacts((prev) => prev.filter((c) => c.username !== username));
      if (activeUser?.username === username) {
        setActiveUser(null);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleContactUpdate = async (contact: { username: string; nickname: string }) => {
    if (!contact.username || !contact.nickname) return;
    try {
      await ContactService.updateContact(contact.username, contact.nickname);
      setContacts((prev) =>
        prev.map((c) => (c.username === contact.username ? { ...c, nickname: contact.nickname } : c))
      );
      if (activeUser?.username === contact.username) {
        setActiveUser({ ...activeUser, nickname: contact.nickname });
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleSaveContact = async (contact: { username: string; nickname: string }) => {
    try {
      await ContactService.createContact({
        contact: contact.username,
        nickname: contact.nickname,
      });
      setContacts((prev) => [...prev, { username: contact.username, nickname: contact.nickname }]);
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  const handleGroupSave = async (groupData: { groupName: string; members: string[] }) => {
    try {
      // 1. Create the group
      const createRes = await GroupService.createGroup({ name: groupData.groupName });
      const newGroup = createRes.group;

      // 2. Add members
      const memberPromises = groupData.members.map((userId) =>
        GroupService.addGroupMember(newGroup.id, userId)
      );
      await Promise.all(memberPromises);

      // 3. Update local state so it shows up in the list
      setGroups((prev) => [newGroup, ...prev]);

    } catch (err) {
      console.error("Group creation failed:", err);
    }
  };

  // 3. User is authorized
  return (
    <div className="root-chat-container">
      <Dashboard
        contacts={contacts}
        groups={groups}
        selectedUser={activeUser}
        onSelect={setActiveUser}
        onSave={handleSaveContact}
        onDelete={handleContactDelete}
        onUpdate={handleContactUpdate}
        onGroupSave={handleGroupSave}
      />
      <Chat
        me={me}
        selectedContact={activeUser}
        photo="/abelovci.png"
        messagesByUser={messagesByUser}
        onSend={sendMessage}
        onDelete={handleContactDelete}
        onUpdate={handleContactUpdate}
        onLoadMore={() => {
          if (activeUser) fetchHistory(activeUser.username, true);
        }}
      />
      {/* ovaj infopanel je visak? */}
      <InfoPanel />
    </div>
  );
}
