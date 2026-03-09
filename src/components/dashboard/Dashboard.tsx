import type { Group } from "../../services/GroupService";
import type { Contact, Selection } from "../ChatApp";
import DashboardChats from "./DashboardChats";
import DashboardFilter from "./DashboardFilter";
import DashboardHeader from "./DashboardHeader";
import DashboardSearch from "./DashboardSearch";

interface DashboardProps {
  contacts: Contact[];
  groups: Group[];
  activeSelection: Selection | null;
  onSelect: (id: string, type: "contact" | "group") => void;
  onSave: (contact: { username: string; nickname: string }) => Promise<void>;
  onDelete: (username: string) => Promise<void>;
  onUpdate: (contact: { username: string; nickname: string }) => Promise<void>;
  onGroupSave: (groupData: { groupName: string; members: string[] }) => Promise<void>;
  onUpdateGroup: (groupId: string, groupData: { groupName: string; members: string[] }) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
}

export default function Dashboard(props: DashboardProps): React.ReactElement {
  return (
    <div className="dashboard-container">
      <DashboardHeader
        contacts={props.contacts}
        onSave={props.onSave}
        onGroupSave={props.onGroupSave}
      />
      <DashboardSearch />
      <DashboardFilter />
      <DashboardChats
        contacts={props.contacts}
        groups={props.groups}
        activeSelection={props.activeSelection}
        onSelect={props.onSelect}
        onDelete={props.onDelete}
        onUpdate={props.onUpdate}
        onUpdateGroup={props.onUpdateGroup}
        onDeleteGroup={props.onDeleteGroup}
      />
    </div>
  );
}