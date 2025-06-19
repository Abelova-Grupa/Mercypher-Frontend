import './App.css'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegistrationForm'
import ForgotPassword from './components/ForgotPassword'
import ChatApp from './components/ChatApp'

import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router'
import type React from 'react'

function App() :React.ReactElement{

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login"/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
        <Route path="/chat" element={<ChatApp/>}/>
      </Routes>
    </Router>
  )
}

export default App
