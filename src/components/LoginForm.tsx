import React, { useState } from 'react'

export default function LoginForm() {

    interface LoginRequest {
        username: string;
        password: string;
    }

    const [form, useForm] = useState<LoginRequest>({
        username: "Username",
        password: "Password",
    });

  return (
    <div className='loginWindow'>
        <img src="" alt="mercypher-logo" />
        <h1>Mercypher</h1>
        <h3>Welcome to Mercypher</h3>
        <h3>The fastest way to private conversations</h3>
        <div>
            <input type="text" value={form.username}/>
            <input type="text" value={form.password} />
        </div>
        <p>Forgot password?</p>
        
        <div></div>
    </div>
  )
}
