import './App.css'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegistrationForm'
import ForgotPassword from './components/ForgotPassword'
import { BrowserRouter as Router, Routes, Route} from 'react-router'


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
      </Routes>
    </Router>
  )
}

export default App
