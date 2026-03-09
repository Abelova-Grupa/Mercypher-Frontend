import { useEffect, useRef, useState } from "react";
import type { MessagePayload } from "../../types/websocket-wrappers";
import type { Contact } from "../ChatApp";
import { GroupService, type Group } from "../../services/GroupService";
import MessageBlob from "./MessageBlob";
import MessageBar from "./MessageBar";
import NewContact from "../dashboard/NewContact";
import NewGroup from "../dashboard/NewGroup"; // Assuming this is where it lives

interface ChatProps {
  activeItem: Contact | Group | null;
  activeType: "contact" | "group" | undefined;
  me: string;
  photo: string;
  messagesByUser: Record<string, MessagePayload[]>;
  allContacts: Contact[]; // Added this to pass to NewGroup edit modal
  onSend: (message: string) => void;
  onLoadMore: () => void;
  onDelete: (username: string) => Promise<void>;
  onUpdate: (contact: { username: string; nickname: string }) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
  onUpdateGroup: (groupId: string, groupData: { groupName: string; members: string[] }) => Promise<void>;
}

export default function Chat(props: ChatProps): React.ReactElement {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [memberNames, setMemberNames] = useState<string>("Loading members...");
  const [showEditGroup, setShowEditGroup] = useState<boolean>(false);

  const isContact = props.activeType === "contact";
  const contact = props.activeItem as Contact;
  const group = props.activeItem as Group;

  // Determine the key for messages
  const key = isContact ? contact?.username : group?.id;
  const messages = key ? props.messagesByUser[key] || [] : [];

  // Fetch Group Members logic copied from GroupCard
  useEffect(() => {
    if (isContact || !group?.id) return;

    let isMounted = true;
    const getMembers = async () => {
      try {
        const res = await GroupService.fetchGroupMembers(group.id);
        if (!isMounted) return;
        const names = res.members
          .map((m: any) => {
            const id = m.user_id;
            return id.charAt(0).toUpperCase() + id.slice(1);
          })
          .filter(Boolean)
          .join(", ");
        setMemberNames(names || "No members");
      } catch (err) {
        if (isMounted) setMemberNames("Error loading members");
      }
    };
    getMembers();
    return () => { isMounted = false; };
  }, [group?.id, isContact]);

  const handleSend = () => {
    if (!message.trim()) return;
    props.onSend(message);
    setMessage("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container && container.scrollTop < 5 && props.activeItem) {
      props.onLoadMore();
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150;
    if (isAtBottom || messages.length === 20) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showNewContact, setShowNewContact] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // 1. Add a state for IDs
  const [currentMemberIds, setCurrentMemberIds] = useState<string[]>([]);

  // 2. Update the existing useEffect that fetches members
  useEffect(() => {
    if (isContact || !group?.id) return;

    let isMounted = true;
    const getMembers = async () => {
      try {
        const res = await GroupService.fetchGroupMembers(group.id);
        if (!isMounted) return;

        const ids = res.members.map((m: any) => m.user_id);
        setCurrentMemberIds(ids); // Store raw IDs for the modal

        const names = ids
          .map((id: string) => id.charAt(0).toUpperCase() + id.slice(1))
          .join(", ");

        setMemberNames(names || "No members");
      } catch (err) {
        if (isMounted) setMemberNames("Error loading members");
      }
    };
    getMembers();
    return () => { isMounted = false; };
  }, [group?.id, isContact]);

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

  if (!props.activeItem) {
    return (
      <div className="chat-container flex items-center justify-center">
        <div className="bg-white/90 px-8 py-4 rounded-full shadow-lg">
          <p className="text-black font-medium">Select a chat to start messaging!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container flex flex-col h-screen max-h-screen w-full overflow-hidden">
      <div className="chat-info-container flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center">
          <div>
            {isContact ? (
              <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-primary to-primary-active flex items-center justify-center text-white font-semibold shadow-sm">
                {contact?.nickname ? contact.nickname[0].toUpperCase() : "?"}
              </div>
            ) : (
              /* Gradient Stacked Avatar for Group */
              <div className="h-[48px] w-[48px] rounded-full bg-gradient-to-tr from-primary to-primary-active  flex items-center justify-center overflow-hidden relative shadow-sm">
                <img src="/account.svg" className="w-7 h-7 invert opacity-85 absolute top-2.5 left-1.5" style={{ transform: 'scale(0.96)' }} />
                <img src="/account.svg" className="w-8 h-8 invert opacity-80 absolute top-2 right-1.5 z-10" />
              </div>
            )}
          </div>
          <div className="ml-4 min-w-0 max-w-[300px]">
            <h2 className="text-lg font-semibold text-slate-800 leading-tight truncate">
              {isContact ? contact.nickname : group.name}
            </h2>
            {isContact ? (
              <p className="text-sm font-medium text-slate-500">@{contact.username}</p>
            ) : (
              /* Fading Members List */
              <div className="relative overflow-hidden">
                <p
                  className="text-sm font-medium text-slate-500 whitespace-nowrap"
                >
                  {memberNames}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Options Menu */}
        <div className="flex items-center relative" ref={menuRef}>
          <button onClick={() => setIsDropDownOpen(!isDropDownOpen)} className="p-1 hover:bg-gray-200 rounded-full text-gray-400 mr-4 cursor-pointer">
            <img className="h-[28px] w-[28px]" src="/three-dots.svg" alt="options" />
          </button>

          {isDropDownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-[60] overflow-hidden top-full">
              <button
                onClick={() => { setIsDropDownOpen(false); isContact ? setShowNewContact(true) : setShowEditGroup(true); }}
                className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                {isContact ? 'Edit contact' : 'Edit group'}
              </button>
              <button
                onClick={() => {
                  setIsDropDownOpen(false);
                  isContact ? props.onDelete(contact.username) : props.onDeleteGroup(group.id);
                }}
                className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showNewContact && isContact && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/20 backdrop-blur-[0.5px] flex justify-start items-start p-10">
          <NewContact
            title="Update contact"
            innerRef={popupRef}
            onClose={() => setShowNewContact(false)}
            onSave={props.onUpdate}
            initUsername={contact.username}
            initNickname={contact.nickname}
          />
        </div>
      )}

      {showEditGroup && !isContact && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/20 backdrop-blur-[0.5px] flex justify-start items-start p-10">
          <div onClick={(e) => e.stopPropagation()}>
            <NewGroup
              title="Update group"
              innerRef={popupRef}
              contacts={props.allContacts}
              onClose={() => setShowEditGroup(false)}
              // THE FIX IS HERE: Wrap the function to pass the group ID
              onSave={(data) => props.onUpdateGroup(group.id, data)}
              initGroupName={group.name}
              initMembers={currentMemberIds}
            />
          </div>
        </div>
      )}

      <div ref={chatContainerRef} onScroll={handleScroll} className="chat flex-1 overflow-y-auto p-4 anchor-none">
        {messages.map((msg, index) => (
          <div key={`${msg.sender_id}-${index}`}>
            <MessageBlob message={msg} senderName={msg.sender_id} isMe={msg.sender_id === props.me} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageBar value={message} onChange={setMessage} onSend={handleSend} />
    </div>
  );
}