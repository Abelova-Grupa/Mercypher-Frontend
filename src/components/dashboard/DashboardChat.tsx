
interface Contact {
  name: string,
  imagePath: string,
  lastMessage: string,
  lastMessageTime: string,
  unreadMessages: number,
}

interface ContactProp {
  contact: Contact
}

export default function DashboardChat({contact}: ContactProp){
  return (
    <div className="dashboard-chat">
      <div className="flex justify-center items-center ml-2">
      <img src={`/${contact.imagePath}`} className="contact-photo" alt="profile pic" />
      </div>
      
      <div className="flex-1 flex flex-col justify-center ml-4">
        <div className="flex justify-between">
          <h2 className="inline">{contact.name}</h2>
          <span className="mr-4">{contact.lastMessageTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="last-message">{contact.lastMessage}</span>
          <button className="mr-5 border rounded-4xl pr-2 pl-2 mt-1 bg-[#54ac64] text-[#ffffff]">{contact.unreadMessages}</button>
        </div>
      </div>

    </div>
  )
}
