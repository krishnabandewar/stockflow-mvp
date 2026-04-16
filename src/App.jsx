import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Settings from './pages/Settings'
import Landing from './pages/Landing'

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const user = useAuthStore(state => state.user)
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

// Public Route Wrapper (redirect to dash if already logged in)
const PublicRoute = ({ children }) => {
  const user = useAuthStore(state => state.user)
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing */}
        <Route path="/" element={
          <PublicRoute><Landing /></PublicRoute>
        } />
        
        {/* Auth routes */}
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute><Signup /></PublicRoute>
        } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute><Products /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
