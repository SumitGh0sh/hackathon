import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Dashboard from './Pages/userDashboard'
import AdminDashboard from './Pages/adminDashboard'

        
function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/dashboard" element={<Dashboard />} />
     <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
