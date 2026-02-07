import type { Contact } from "../ChatApp";
import { ContactCard } from "./Contact";

interface DashboardChatProps {
  contacts: Contact[] | null;
  selectedUser: Contact | null;
  onSelect: (contact: Contact) => void;
}
export default function DashboardChats(props: DashboardChatProps) {
  return (
    <div className="flex m-0">
      <div className="w-100">
        <ul>
          {props.contacts ? (
            props.contacts.map((contact) => (
              <ContactCard
                key={contact.username}
                contact={contact}
                isSelected={props.selectedUser === contact}
                onClick={() => props.onSelect(contact)}
              />
            ))
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
}
