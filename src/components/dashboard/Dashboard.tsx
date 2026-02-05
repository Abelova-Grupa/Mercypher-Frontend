import DashboardChats from "./DashboardChats";
import DashboardFilter from "./DashboardFilter";
import DashboardHeader from "./DashboardHeader";
import DashboardSearch from "./DashboardSearch";

interface DashboardProps {
  contacts: string[];
  selectedUser: string | null;
  onSelect: (username: string) => void;
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