import React from 'react'
import { useUser } from '../context/user.context'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <i className="ri-loader-4-line animate-spin text-3xl text-blue-500"></i>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
