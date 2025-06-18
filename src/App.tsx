import './App.css'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegistrationForm'
import { BrowserRouter as Router, Routes, Route} from 'react-router'


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
      </Routes>
    </Router>
  )
}

export default App
