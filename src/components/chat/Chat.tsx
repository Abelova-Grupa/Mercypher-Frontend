import MessageBar from "./MessageBar";

interface ChatProps {
    group: string,
    participants: string,
    photo: string
}

export default function Chat(props: ChatProps) :React.ReactElement{
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
            <MessageBar/>
        </div>
    )
}