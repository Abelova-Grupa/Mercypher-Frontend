import type React from "react";
import Chat from "./chat/Chat";
import Dashboard from "./dashboard/Dashboard";
import InfoPanel from "./info/InfoPanel";

export default function ChatApp() :React.ReactElement{
    return (
        <div className="root-chat-container">
            <Dashboard/>
            <Chat/>
            <InfoPanel/>
        </div>
    )
}