
export default function DashboardChat() {
  return (
    <div className="dashboard-chat">
      <div className="flex justify-center items-center ml-2">
      <img src="/abelovci.png" className="contact-photo" alt="profile pic" />
      </div>
      
      <div className="flex-1 flex flex-col justify-center ml-4">
        <div className="flex justify-between">
          <h2 className="inline">Abelova Grupa</h2>
          <span className="mr-4">23:59</span>
        </div>
        <div className="flex justify-between">
          <span className="last-message">Abelovac: Jel izlazite na kolokvijume?</span>
          <button className="mr-5 border rounded-4xl pr-2 pl-2 mt-1 bg-[#54ac64] text-[#ffffff]">1</button>
        </div>
      </div>

    </div>
  )
}
