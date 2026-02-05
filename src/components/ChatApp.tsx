import type React from "react";
import Chat from "./chat/Chat";
import Dashboard from "./dashboard/Dashboard";
import InfoPanel from "./info/InfoPanel";
import { useEffect, useState } from "react";
import { ContactService } from "../services/ContactService";

export default function ChatApp() :React.ReactElement{

    const [contacts, setContacts] = useState<string[]>([]);
    const [activeUser, setActiveUser] = useState<string | null>(null);

    useEffect(() => {
        ContactService.fetchContacts().then(c => {setContacts(c.contacts)});
    }, [])

    console.log(contacts)

    return (
        <div className="root-chat-container">
            <Dashboard contacts={contacts} selectedUser={activeUser} onSelect={setActiveUser}/>
            <Chat group="Abelova grupa" participants="Mile Dizna, Cane Kurbla, Mita Likar, Mita Balija" photo="/abelovci.png"/>
            <InfoPanel/>
        </div>
    )
}