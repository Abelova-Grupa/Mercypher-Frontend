
export default function DashboardHeader() {
  return (
    <div className="dashboard-header">
      <div className="dashboard-title">
          <img className="header-img" src="/mercury_head_logo.png" alt="mercypher logo" />
          <h1 className="header-title">Mercypher</h1>
      </div>
      
      <div className="dashboard-btns">
        <button className="new-chat-btn">
        <img className="add-header-btn" src="/add-square.svg" alt="add button" />
        </button>
        <button className="options-btn">
          <img className="option-header-btn" src="/three-dots.svg" alt="add button" />
        </button>
      </div>
      
    </div>
  )
}
