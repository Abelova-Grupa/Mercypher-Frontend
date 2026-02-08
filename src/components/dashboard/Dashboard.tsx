import type { Contact } from "../ChatApp";
import DashboardChats from "./DashboardChats";
import DashboardFilter from "./DashboardFilter";
import DashboardHeader from "./DashboardHeader";
import DashboardSearch from "./DashboardSearch";
import { ContactService } from "../../services/ContactService";

interface DashboardProps {
  contacts: Contact[];
  selectedUser: Contact | null;
  onSelect: (contact: Contact) => void;
  onSetContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

export default function Dashboard(props: DashboardProps): React.ReactElement {
  const handleSaveContact = async (contact: {
    username: string;
    nickname: string;
  }) => {
    try {
      await ContactService.createContact({
        contact: contact.username,
        nickname: contact.nickname,
      });

      props.onSetContacts((prev) => [
        ...prev,
        { username: contact.username, nickname: contact.nickname },
      ]);

      console.log("Contact successfully created");
    } catch (error) {
      console.error("Contact creation failed: " + error);
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader onSave={handleSaveContact} />
      <DashboardSearch />
      <DashboardFilter />
      <DashboardChats
        onSetContacts={props.onSetContacts}
        contacts={props.contacts}
        selectedUser={props.selectedUser}
        onSelect={props.onSelect}
      />
    </div>
  );
}
