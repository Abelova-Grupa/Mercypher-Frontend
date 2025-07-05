import { useEffect, useRef, useState } from "react"
import NewChat from "./NewChat";

export default function DashboardHeader() {

  const [showNewContact, setShowNewContact] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleNewContact = () => {
    setShowNewContact(showNewContact => !showNewContact)
  }

  useEffect(() => {
    const handleClickOutside = (e :MouseEvent) => {
      const target = e.target as Node
      if(popupRef.current && !popupRef.current.contains(e.target as Node)
      && btnRef.current && !btnRef.current.contains(target)){
        setShowNewContact(false)
      }
    }  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown",handleClickOutside);
  },[])

  return (
    <div className="dashboard-header">
      <div className="dashboard-title">
          <img className="header-img" src="/mercury_head_logo.png" alt="mercypher logo" />
          <h1 className="header-title">Mercypher</h1>
      </div>
      
      <div className="dashboard-btns">
        <button ref={btnRef} className="new-chat-btn" onClick={handleNewContact}>
        <img className="add-header-btn" src="/add-square.svg" alt="add button" />
        </button>
        {showNewContact &&
        <NewChat ref={popupRef}/>}
        <button className="options-btn">
          <img className="option-header-btn" src="/three-dots.svg" alt="add button" />
        </button>
      </div>
      
    </div>
  )
}
