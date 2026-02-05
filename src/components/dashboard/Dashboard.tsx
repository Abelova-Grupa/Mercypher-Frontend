import type { Contact } from "../ChatApp";
import DashboardChats from "./DashboardChats";
import DashboardFilter from "./DashboardFilter";
import DashboardHeader from "./DashboardHeader";
import DashboardSearch from "./DashboardSearch";

interface DashboardProps {
  contacts: Contact[];
  selectedUser: Contact | null;
  onSelect: (contact: Contact) => void;
}

export default function Dashboard(props: DashboardProps) :React.ReactElement{
    return (
        <div className="dashboard-container">
            <DashboardHeader/>
            <DashboardSearch/>
            <DashboardFilter/>
            <DashboardChats 
                contacts={props.contacts} 
                selectedUser={props.selectedUser} 
                onSelect={props.onSelect} 
            />
        </div>
    )
}