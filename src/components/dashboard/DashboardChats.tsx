import { ContactService } from "../../services/ContactService";
import type { Contact } from "../ChatApp";
import { ContactCard } from "./Contact";

interface DashboardChatProps {
  contacts: Contact[] | null;
  selectedUser: Contact | null;
  onSelect: (contact: Contact) => void;
  onSetContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}
export default function DashboardChats(props: DashboardChatProps) {
  const handleContactDelete = async (username: string) => {
    if (username === "") {
      return;
    }
    try {
      await ContactService.deleteContact(username);
      props.onSetContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.username !== username),
      );
    } catch (error) {
      console.error("Could delete contact: " + error);
    }
  };

  const handleContactUpdate = async (contact: {
    username: string;
    nickname: string;
  }) => {
    if (
      contact === undefined ||
      contact.username === "" ||
      contact.nickname === ""
    )
      return;

    try {
      // 1. Poziv servisu
      await ContactService.updateContact(contact.username, contact.nickname);

      // 2. Ažuriranje lokalnog stanja (re-render)
      props.onSetContacts((prevContacts) =>
        prevContacts.map((c) =>
          c.username === contact.username
            ? { ...c, nickname: contact.nickname }
            : c,
        ),
      );
    } catch (error) {
      console.error("Could not update contact: " + error);
    }
  };

  return (
    <div className="flex m-0">
      <div className="w-100">
        <ul>
          {props.contacts ? (
            props.contacts.map((contact) => (
              <ContactCard
                onDelete={handleContactDelete}
                onUpdate={handleContactUpdate}
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
