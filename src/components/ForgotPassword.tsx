import { useState } from "react";

export default function ForgotPassword() :React.ReactElement{
    const [email, setEmail] = useState<string>('')    

    return (
        <div className="login-container">
            <div className="h-[50%]">
                <img src="/doodle-mailbox.png" className="w-[300px] h-[300px]" alt="alert-icon" />
            </div>
            <div className="w-[80%] mb-2 pl-2 text-xl font-semibold text-left">
                <p>Enter your confirmation email</p>
            </div>
            <input className="forgot-input" type="text" value={email} onChange={
                (e) => setEmail(e.target.value)
            }/>
            <button className="forgot-button">Send Email</button>
        </div>
    )

}
