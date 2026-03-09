import type React from "react";
import Chat from "./chat/Chat";
import Dashboard from "./dashboard/Dashboard";
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

export type Selection = {
  id: string; // This will be username OR group_id
  type: "contact" | "group";
};

export default function ChatApp(): React.ReactElement {
  const BACKEND_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;
  
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeSelection, setActiveSelection] = useState<Selection | null>(null);
  const activeItem = activeSelection?.type === "contact"
    ? contacts.find((c) => c.username === activeSelection.id) || null
    : groups.find((g) => g.id === activeSelection?.id) || null;

  const [messagesByUser, setMessagesByUser] = useState<Record<string, MessagePayload[]>>({});
  const [me, setMe] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(true);
  const [historyLoaded, setHistoryLoaded] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const id = activeSelection?.id;
    // If we have a selection and we HAVEN'T loaded its history yet
    if (id && !historyLoaded[id]) {
      fetchHistory(id);
    }
  }, [activeSelection?.id, historyLoaded]);

  const handleSelect = (id: string, type: "contact" | "group") => {
    setActiveSelection({ id, type });
  };
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
    const ws = new WebSocket(`ws://${BACKEND_URL}/ws`);

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

  const sendMessage = (messageText: string) => {
    if (!wsRef.current || !activeSelection || !me || wsRef.current.readyState !== WebSocket.OPEN) return;

    const encodedBody = btoa(encodeURIComponent(messageText).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(Number('0x' + p1));
      }));

    const msg: MessagePayload = {
      sender_id: me,
      receiver_id: activeSelection.id, // this should be username for contacts and group_id for groups
      body: encodedBody,
    };

    wsRef.current.send(JSON.stringify({ type: "message", data: msg }));

    // optional: optimistic update
    // handleIncomingMessage(msg)
  };

  // const handleIncomingMessage = (msg: MessagePayload) => {
  //   const conversationId = msg.sender_id === me ? msg.receiver_id : msg.sender_id;

  //   if (!conversationId) return;

  //   setMessagesByUser((prev) => {
  //     const existingMessages = prev[conversationId] || [];

  //     return {
  //       ...prev,
  //       [conversationId]: [...existingMessages, msg],
  //     };
  //   });
  // };

  const handleIncomingMessage = (msg: MessagePayload) => {
    // Regex to check for standard UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(msg.receiver_id);

    let conversationKey: string;

    if (isUUID) {
      // If receiver is a UUID, it's a group chat. Key = Group ID.
      conversationKey = msg.receiver_id;
    } else {
      // If not a UUID, it's a private chat. 
      // Key = the person who isn't 'me'.
      conversationKey = msg.sender_id === me ? msg.receiver_id : (msg.sender_id || "");
    }

    console.log(`[WS DEBUG] Target Key: ${conversationKey} | From: ${msg.sender_id} | UUID: ${isUUID}`);

    if (!conversationKey) return;

    setMessagesByUser((prev) => {
      const existing = prev[conversationKey] || [];

      // Prevent duplicates
      if (existing.some(m => m.timestamp === msg.timestamp && m.body === msg.body)) {
        return prev;
      }

      return {
        ...prev,
        [conversationKey]: [...existing, msg],
      };
    });
  };

  const fetchHistory = async (contactUsername: string, isLoadMore = false) => {
    const currentMessages = messagesByUser[contactUsername] || [];

    // If loading more, use the timestamp of the OLDEST message we have.
    const lastSeen = isLoadMore && currentMessages.length > 0
      ? currentMessages[0].timestamp
      : Math.floor(Date.now() / 1000);

    try {
      const res = await fetch(`http://${BACKEND_URL}/loadMessages`, {
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
      const history = [...data.messages].reverse();

      setMessagesByUser((prev) => {
        const existing = prev[contactUsername] || [];

        if (isLoadMore) {
          return {
            ...prev,
            [contactUsername]: [...history, ...existing],
          };
        } else {
          const filteredHistory = history.filter(hMsg =>
            !existing.some(eMsg =>
              eMsg.timestamp === hMsg.timestamp && eMsg.body === hMsg.body
            )
          );

          return {
            ...prev,
            [contactUsername]: [...filteredHistory, ...existing],
          };
        }
      });
      setHistoryLoaded(prev => ({ ...prev, [contactUsername]: true }));
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
      if (activeSelection?.id === username && activeSelection?.type === "contact") {
        setActiveSelection(null);
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
      // if (activeUser?.username === contact.username) {
      //   setActiveUser({ ...activeUser, nickname: contact.nickname });
      // }
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

  const handleGroupDelete = async (groupId: string) => {
    if (!groupId) return;
    try {
      await GroupService.deleteGroup(groupId);
      // Remove from local state
      setGroups((prev) => prev.filter((g) => g.id !== groupId));

      // If the deleted group was active, clear the selection
      if (activeSelection?.id === groupId && activeSelection?.type === "group") {
        setActiveSelection(null);
      }
    } catch (error) {
      console.error("Group delete failed:", error);
    }
  };

  const handleGroupUpdate = async (groupId: string, groupData: { groupName: string; members: string[] }) => {
    if (!groupId) return;

    try {
      // 1. Update Name
      await GroupService.updateGroup(groupId, groupData.groupName);

      // 2. Diff Members
      const res = await GroupService.fetchGroupMembers(groupId);
      const currentMemberIds = res.members.map((m: any) => m.user_id);

      // Safety: Always include yourself
      const desiredMembers = groupData.members.includes(me)
        ? groupData.members
        : [...groupData.members, me];

      const toAdd = desiredMembers.filter(id => !currentMemberIds.includes(id));
      const toRemove = currentMemberIds.filter(id => !desiredMembers.includes(id));

      // 3. API Calls
      await Promise.all([
        ...toAdd.map(id => GroupService.addGroupMember(groupId, id)),
        ...toRemove.map(id => GroupService.removeGroupMember(groupId, id))
      ]);

      // 4. Update UI State
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, name: groupData.groupName } : g))
      );

      console.log("Group sync complete");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  // 3. User is authorized
  return (
    <div className="root-chat-container">
      <Dashboard
        contacts={contacts}
        groups={groups}
        activeSelection={activeSelection}
        onSelect={handleSelect}
        onSave={handleSaveContact}
        onDelete={handleContactDelete}
        onUpdate={handleContactUpdate}
        onGroupSave={handleGroupSave}
        // Pass group handlers to Dashboard if you want Edit/Delete from the sidebar
        onDeleteGroup={handleGroupDelete}
        onUpdateGroup={handleGroupUpdate}
      />
      <Chat
        me={me}
        activeItem={activeItem}
        activeType={activeSelection?.type}
        allContacts={contacts} // Needed for the NewGroup modal inside Chat
        photo="/account.svg"
        messagesByUser={messagesByUser}
        onSend={sendMessage}
        onDelete={handleContactDelete}
        onUpdate={handleContactUpdate}
        onDeleteGroup={handleGroupDelete}
        onUpdateGroup={handleGroupUpdate}
        onLoadMore={() => {
          if (activeSelection?.type === "contact") {
            fetchHistory(activeSelection.id, true);
          }
          // Add fetchGroupHistory(activeSelection.id, true) here later
        }}
      />
    </div>
  )
};
