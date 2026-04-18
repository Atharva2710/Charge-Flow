import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute — wraps any page that requires authentication.
 * If user is not logged in, redirects to /auth and saves the
 * attempted URL so we can redirect back after login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // While checking session, show a minimal loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <p className="text-muted text-sm">Loading session...</p>
        </div>
      </div>
    )
  }

  // Not authenticated → redirect to /auth, preserve the attempted location
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Authenticated → render the protected page
  return children
}
