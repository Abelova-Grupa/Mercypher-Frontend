import { useState } from "react"

export default function RegisterForm() :React.ReactElement{
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirm, setConfirm] = useState<string>('')

    return (
        <div className="register-container">
            <div className="register-image">
                <img className="w-[450px] h-[450px]" src="/planet.png" alt="globe" />
            </div>
            <div className="register-input-container">
                <h1 className="register-title">Sign up to Mercypher</h1>
                <div className="register-subtitle mb-1">
                    <p>Username</p>
                </div>
                <input className='register-input' name= "username" type="text" value={username} onChange={
                    (e) => setUsername(e.target.value)
                }/>
                <div className="register-subtitle mb-1">
                    <p>Email</p>
                </div>
                <input className="register-input" name= "email" type="text" value={email} onChange={
                    (e) => setEmail(e.target.value)
                }/>
                <div>

                </div>
                <div className="register-subtitle mb-1">
                    <p>Password</p>
                </div>
                <input className="register-input" name= "password" type="password" value={password} onChange={
                    (e) => setPassword(e.target.value)
                }/>
                <div className="register-subtitle mb-1">
                    <p>Confirm password</p>
                </div>
                <input className="register-input" name= "password" type="password" value={confirm} onChange={
                    (e) => setConfirm(e.target.value)
                }/>
                <button className="register-button">Sign up</button>
            </div>
        </div>
    )
}