import { Contact } from "./Contact";

interface DashboardChatProps {
  contacts: string[];
  selectedUser: string | null;
  onSelect: (username: string) => void;
}
export default function DashboardChats(props: DashboardChatProps) {
  return (
    <div className="flex m-0">
      <div className="w-100">
        <ul>
          {props.contacts.map((username) => (
            <Contact
              key={username}
              username={username}
              isSelected={props.selectedUser === username}
              onClick={() => props.onSelect(username)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
