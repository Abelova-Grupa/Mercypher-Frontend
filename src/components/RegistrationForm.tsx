import { useState } from "react"

export default function RegisterForm(){
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <div className="register-container">
            <div className="register-image">
                <img className="w-[250px] h-[250px]" src="/globe.png" alt="globe" />
            </div>
            <div className="register-input-container">
                <h1 className="register-title">Sign up to Mercypher</h1>
                <div className="register-subtitle ">
                    <p>Username</p>
                </div>
                <input className='register-input' name= "username" type="text" value={username} onChange={
                    (e) => setUsername(e.target.value)
                }/>
                <div className="register-subtitle">
                    <p>Email</p>
                </div>
                <input className="register-input" name= "email" type="text" value={email} onChange={
                    (e) => setEmail(e.target.value)
                }/>
                <div>

                </div>
                <div className="register-subtitle">
                    <p>Password</p>
                </div>
                <input className="register-input" name= "password" type="password" value={password} onChange={
                    (e) => setPassword(e.target.value)
                }/>
                <button className="register-button">Sign up</button>
            </div>
        </div>
    )
}