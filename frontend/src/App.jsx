import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Dashboard from './Pages/userDashboard'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
