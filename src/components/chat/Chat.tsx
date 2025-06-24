import MessageBar from "./MessageBar";

export default function Chat() :React.ReactElement{
    return (
        <div className="chat-container">
            <div className="chat-info-container">
                <div className="flex">
                    <div>
                        <img className="h-[48px] w-[48px] rounded-4xl ml-4" src="/abelovci.png" alt="contact photo" />
                    </div>
                    <div className="ml-4">
                        <h2>Abelova Grupa</h2>
                        <p>Aleksandra, Ana, Andrea, Andrej, Andrej, Djokic, Jelisavac, Dejic, Grcic, marija, Stefan, Zoran, You</p>
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