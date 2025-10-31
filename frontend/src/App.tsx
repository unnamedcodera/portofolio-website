import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { setLogoutCallback } from './services/api'
import LoadingScreen from './components/LoadingScreen.tsx'

// Lazy load components for code splitting
const MainContent = lazy(() => import('./components/MainContent.tsx'))
const ProjectDetail = lazy(() => import('./components/ProjectDetail.tsx'))
const ProjectsList = lazy(() => import('./components/ProjectsList.tsx'))
const LoginPage = lazy(() => import('./components/admin/LoginPage.tsx'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard.tsx'))
const ProjectEditor = lazy(() => import('./components/admin/ProjectEditor.tsx'))

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token')
    setIsAuthenticated(!!token)

    // Set logout callback for API interceptor
    setLogoutCallback(() => {
      setIsAuthenticated(false)
    })

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('adminActiveTab')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainContent />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              isAuthenticated ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          
          {/* Project Editor Routes */}
          <Route
            path="/admin/project/new"
            element={
              isAuthenticated ? (
                <ProjectEditor />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
          <Route
            path="/admin/project/edit/:id"
            element={
              isAuthenticated ? (
                <ProjectEditor />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
