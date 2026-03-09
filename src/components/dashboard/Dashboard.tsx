import type { Group } from "../../services/GroupService";
import type { Contact } from "../ChatApp";
import DashboardChats from "./DashboardChats";
import DashboardFilter from "./DashboardFilter";
import DashboardHeader from "./DashboardHeader";
import DashboardSearch from "./DashboardSearch";

interface DashboardProps {
  contacts: Contact[];
  groups: Group[];
  selectedUser: Contact | null;
  onSelect: (contact: Contact) => void;
  onSave: (contact: { username: string; nickname: string }) => Promise<void>;
  onDelete: (username: string) => Promise<void>;
  onUpdate: (contact: { username: string; nickname: string }) => Promise<void>;
  onGroupSave: (groupData: { groupName: string; members: string[] }) => Promise<void>;
}

export default function Dashboard(props: DashboardProps): React.ReactElement {
  return (
    <div className="dashboard-container">
      <DashboardHeader contacts={props.contacts} onSave={props.onSave} onGroupSave={props.onGroupSave} />
      <DashboardSearch />
      <DashboardFilter />
      <DashboardChats
        contacts={props.contacts}
        selectedUser={props.selectedUser}
        onSelect={props.onSelect}
        onDelete={props.onDelete}
        onUpdate={props.onUpdate}
      />
    </div>
  );
}
