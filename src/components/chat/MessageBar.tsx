

export default function MessageBar() {
  return (
    <div className="message-bar">
        <div className="message-bar-emoji-btn-container">
            <button className="emoji-btn">
                <img className="emoji-btn-img" src="/smile-square.svg"  alt="emoji icon" />
            </button>
        </div>
        <div className="message-bar-input-container">
            <input className="message-bar-input" type="text" />
        </div>
        <div className="message-bar-extra-container">
            <button className="extra-btn">
                <img className="extra-btn-img" src="/file-plus.svg" alt="extra icon" />
            </button>
        </div>
    </div>
  )
}
