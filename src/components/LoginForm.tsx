import React, { useState } from 'react'

export default function LoginForm(){

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = () => {
        console.log(username);
        console.log(password);
    }
    
  return (
    <div className='flex flex-col loginWindow rounded-2xl w-[500px] h-[600px] '>
        <img className='w-[100px] h-[100px] mx-auto mt-2' src="/mercury_head_logo.png" alt="mercypher-logo" />
        <h1>Mercypher</h1>
        <h3>Welcome to Mercypher</h3>
        <h3>The fastest way to private conversations</h3>
        <div className='flex flex-col justify-center items-center'>
            <input className='inputFields' type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input className='inputFields' type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <p>Forgot password?</p>
        <button className='loginBtn rounded-2xl' style={{backgroundColor: '#54ac64'}} onClick={handleLogin}>Log in</button>
        <div>
            <span>Don't have an account?</span>
            <button>Sign up</button>
        </div>
        <div></div>
    </div>
  )
}
