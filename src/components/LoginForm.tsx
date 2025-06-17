import React, { useState } from 'react'

export default function LoginForm(){

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = () => {
        console.log(username);
        console.log(password);
    }
    
  return (
    <div className='flex flex-col loginWindow rounded-2xl w-[500px] h-[600px] border-2 items-center'>
        <img className='w-[100px] h-[100px] mx-auto mt-2' src="/mercury_head_logo.png" alt="mercypher-logo" />
        <h1 className='mt-[-8px] text-4xl font-semibold'>Mercypher</h1>
        <h3 className='mt-4 text-2xl font-extralight'>Welcome to Mercypher</h3>
        <h3 className='text-2xl font-extralight'>The fastest way to private conversations</h3>
        <div className='mt-10 flex flex-col justify-center items-center w-[80%]'>
            <input className='input block border-2 rounded-2xl w-[100%] h-[50px] px-4 py-2 border-gray-500' type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input className='input mt-6 block border-2 rounded-2xl w-[100%] h-[50px] px-4 py-2 border-gray-500' type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className='flex justify-end mt-2 w-[80%]  text-xl font-light'>
            <button>Forgot password?</button>
        </div>
        
        <button className='mt-4 w-[80%] h-[50px] bg-[#55AC65] text-[#ffffff] text-xl rounded-2xl' style={{backgroundColor: '#54ac64'}} onClick={handleLogin}>Log in</button>
        <div className='mt-2 font-light'>
            <span className='mr-2'>Don't have an account?</span>
            <button className='bg-transparent border-none text-[#55AC65] font-medium'>Sign up</button>
        </div>
        <div></div>
    </div>
  )
}
