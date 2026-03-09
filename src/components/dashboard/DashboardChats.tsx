import type { Contact, Selection } from "../ChatApp";
import type { Group } from "../../services/GroupService";
import { ContactCard } from "./Contact";
import { GroupCard } from "./GroupCard";
interface DashboardChatProps {
  onUpdateGroup: (groupId: string, groupData: { groupName: string; members: string[] }) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
  contacts: Contact[];
  groups: Group[];
  activeSelection: Selection | null;
  onSelect: (id: string, type: "contact" | "group") => void;
  onDelete: (username: string) => Promise<void>;
  onUpdate: (contact: { username: string; nickname: string }) => Promise<void>;

}
export default function DashboardChats(props: DashboardChatProps) {
  return (
    <div className="flex m-0 overflow-y-auto">
      <div className="w-full">
        <ul>
          {props.groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              allContacts={props.contacts}
              isSelected={props.activeSelection?.id === group.id}
              onClick={() => props.onSelect(group.id, "group")}
              onDelete={props.onDeleteGroup}
              onUpdate={props.onUpdateGroup}
            />
          ))}
          {props.contacts.map((contact) => (
            <ContactCard
              key={contact.username}
              contact={contact}
              onDelete={props.onDelete}
              onUpdate={props.onUpdate}
              isSelected={
                props.activeSelection?.id === contact.username &&
                props.activeSelection?.type === "contact"
              }
              onClick={() => props.onSelect(contact.username, "contact")}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}