import { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "groups">("all");
  const filteredGroups = (props.groups ?? []).filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredContacts = activeFilter === "all"
    ? (props.contacts ?? []).filter(c =>
      c.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <div className="dashboard-container">
      <DashboardHeader
        contacts={props.contacts ?? []}
        onSave={props.onSave}
        onGroupSave={props.onGroupSave}
      />
      <DashboardSearch onSearchChange={setSearchQuery} />
      <DashboardFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <DashboardChats
        contacts={filteredContacts}
        groups={filteredGroups}
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