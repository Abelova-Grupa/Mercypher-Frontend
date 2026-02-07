import { useState } from "react"

interface ChatProps {
    group: string,
    participants: string,
    photo: string,
    onSend: (message: string) => void
}

export default function Chat(props: ChatProps) :React.ReactElement{

    const [message, setMessage] = useState("")

    const handleSend = () => {
        if (!message.trim()) return
        props.onSend(message)
        setMessage("")
    }

    return (
        <div className="chat-container">
            <div className="chat-info-container">
                <div className="flex">
                    <div>
                        <img className="h-[48px] w-[48px] rounded-4xl ml-4" src={props.photo} alt="contact photo" />
                    </div>
                    <div className="ml-4">
                        <h2>{props.group}</h2>
                        <p>{props.participants}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <button className="mr-4">
                        <img className="h-[24px] w-[24px]" src="/search.svg" alt="search" />
                    </button>
                    <button className="mr-4">
                        <img className="h-[28px] w-[28px]" src="/three-dots.svg" alt="options" />
                    </button>
                </div>
            </div>
            <div className="chat"></div>
            {/* <MessageBar/> */}
            <div className="message-bar">
                <div className="message-bar-emoji-btn-container">
                    <button className="emoji-btn">
                        <img className="emoji-btn-img" src="/smile-square.svg"  alt="emoji icon" />
                    </button>
                </div>
                <div className="message-bar-input-container">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type message..."
                    />
                    <button onClick={handleSend}>
                        Send
                    </button>
                </div>
                <div className="message-bar-extra-container">
                    <button className="extra-btn">
                        <img className="extra-btn-img" src="/file-plus.svg" alt="extra icon" />
                    </button>
                </div>
            </div>
        </div>
    )
}