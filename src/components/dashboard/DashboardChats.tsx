import type { Contact } from "../ChatApp";
import { ContactCard } from "./Contact";

interface DashboardChatProps {
  contacts: Contact[] | null;
  selectedUser: Contact | null;
  onSelect: (contact: Contact) => void;
  onDelete: (username: string) => Promise<void>;
  onUpdate: (contact: { username: string; nickname: string }) => Promise<void>;
}
export default function DashboardChats(props: DashboardChatProps) {
  return (
    <div className="flex m-0">
      <div className="w-100">
        <ul>
          {props.contacts?.map((contact) => (
            <ContactCard
              onDelete={props.onDelete}
              onUpdate={props.onUpdate}
              key={contact.username}
              contact={contact}
              isSelected={props.selectedUser?.username === contact.username}
              onClick={() => props.onSelect(contact)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
