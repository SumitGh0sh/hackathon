import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Dashboard from './Pages/userDashboard'
import AdminDashboard from './Pages/adminDashboard'
import AdminDetailsPage from './Pages/AdminDetailsPage.jsx'
import SchemeApplicationPage from './Pages/SchemeApplicationPage'

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const role = localStorage.getItem('role')
    return {
      token,
      userId,
      role,
      isAuthenticated: Boolean(token),
    }
  })

  const parseUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        id: payload?.id || '',
        role: payload?.role || ''
      }
    } catch (error) {
      return { id: '', role: '' }
    }
  }

  const handleAuthSuccess = ({ token, role }) => {
    const parsed = parseUserIdFromToken(token)
    const effectiveRole = role || parsed.role || 'user'
    localStorage.setItem('token', token)
    localStorage.setItem('userId', parsed.id)
    localStorage.setItem('role', effectiveRole)
    setAuth({ token, userId: parsed.id, role: effectiveRole, isAuthenticated: true })
  }

  const handleSignOut = async () => {
    try {
      if (auth.token) {
        await fetch('http://localhost:5000/api/users/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        })
      }
    } catch (error) {
      // Ignore network errors and still clear local auth state.
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('role')
      setAuth({ token: null, userId: '', role: '', isAuthenticated: false })
    }
  }

  return (
    <Routes>
     <Route path="/" element={<HomePage isAuthenticated={auth.isAuthenticated} role={auth.role} onAuthSuccess={handleAuthSuccess} onSignOut={handleSignOut} />} />
     <Route path="/login" element={<HomePage isAuthenticated={auth.isAuthenticated} role={auth.role} onAuthSuccess={handleAuthSuccess} onSignOut={handleSignOut} openLoginOnMount />} />
     <Route path="/dashboard" element={auth.isAuthenticated && auth.role === 'user' ? <Dashboard onSignOut={handleSignOut} auth={auth} /> : <Navigate to="/" replace />} />
     <Route path="/admin" element={auth.isAuthenticated && auth.role === 'admin' ? <AdminDashboard onSignOut={handleSignOut} auth={auth} /> : <Navigate to="/" replace />} />
     <Route path="/apply/:schemeId" element={auth.isAuthenticated && auth.role === 'user' ? <SchemeApplicationPage auth={auth} /> : <Navigate to="/" replace />} />
     <Route path="/admin-details" element={<AdminDetailsPage onAuthSuccess={handleAuthSuccess} />} />
    </Routes>
  )
}

export default App
