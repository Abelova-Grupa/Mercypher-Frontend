import { useState } from "react"

export default function RegisterForm(){
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <div className="registerContainer">
            <div className="formImg"></div>
            <div className="formInput">
                <h1 className="formTitle">Sign up to Mercypher</h1>
                <h3 className="formSubTitle">Username</h3>
                <input className='registerInput' name= "username" type="text" value={username} onChange={
                    (e) => setUsername(e.target.value)
                }/>
                <h3 className="formSubTitle">Email</h3>
                <input className="registerInput" name= "email" type="text" value={email} onChange={
                    (e) => setEmail(e.target.value)
                }/>
                <h3 className="formSubtitle">Password</h3>
                <input className="registerInput" name= "password" type="text" value={password} onChange={
                    (e) => setPassword(e.target.value)
                }/>
            </div>
        </div>
    )
}