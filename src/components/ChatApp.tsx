import type React from "react";
import Chat from "./chat/Chat";
import Dashboard from "./dashboard/Dashboard";
import InfoPanel from "./info/InfoPanel";
import { useEffect, useRef, useState } from "react";
import { ContactService } from "../services/ContactService";
import type { Envelope, MessagePayload } from "../types/websocket-wrappers";

export type Contact = {
    username: string,
    nickname: string
}

export default function ChatApp() :React.ReactElement{

    const wsRef = useRef<WebSocket | null>(null)
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [activeUser, setActiveUser] = useState<Contact | null>(null);

    useEffect(() => {

        // Contacts
        ContactService.fetchContacts().then(c => {setContacts(c.contacts)});


        // Websocket init
        const ws = new WebSocket("ws://localhost:8080/ws")

        ws.onopen = () => {
            console.log("Connected")
        }

        ws.onmessage = (event) => {
            const envelope: Envelope = JSON.parse(event.data)
            console.log("Received:", envelope)
        }

        ws.onclose = () => {
            console.log("Disconnected")
        }

        wsRef.current = ws

        return () => {
            ws.close()
        }

    }, [])

    const sendMessage = (messageText: string) => {

        if (!wsRef.current || !activeUser) return

        const payload: MessagePayload = {
            receiver_id: activeUser.username,
            body: messageText,
        }

        const envelope: Envelope<MessagePayload> = {
            type: "message",
            data: payload,
        }

        wsRef.current.send(JSON.stringify(envelope))
    }


    console.log(contacts)

    return (
        <div className="root-chat-container">
            <Dashboard contacts={contacts} selectedUser={activeUser} onSelect={setActiveUser}/>
            <Chat 
                group="Abelova grupa" 
                participants="Mile Dizna, Cane Kurbla, Mita Likar, Mita Balija" 
                photo="/abelovci.png"
                onSend={sendMessage}
                />
            <InfoPanel/>
        </div>
    )
}