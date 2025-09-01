import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import CreateAccount from './components/CreateAccount'
import ATM from './components/ATM'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/atm" element={<ATM />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App