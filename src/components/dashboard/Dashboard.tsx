import DashboardChats from "./DashboardChats";
import DashboardFilter from "./DashboardFilter";
import DashboardHeader from "./DashboardHeader";
import DashboardSearch from "./DashboardSearch";

export default function Dashboard() :React.ReactElement{
    return (
        <div className="dashboard-container">
            <DashboardHeader/>
            <DashboardSearch/>
            <DashboardFilter/>
            <DashboardChats/>
        </div>
    )
}