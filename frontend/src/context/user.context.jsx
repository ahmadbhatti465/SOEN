import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../api/axios'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize user and token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
      fetchProfile(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  // Keep axios default auth header in sync with token
  useEffect(() => {
    if (token) {
      try { window.localStorage.setItem('token', token) } catch (e) {}
    } else {
      try { window.localStorage.removeItem('token') } catch (e) {}
    }
  }, [token])

  // Fetch user profile data
  const fetchProfile = async (authToken) => {
    try {
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      setUser(res.data.user)
      setIsAuthenticated(true)
    } catch (err) {
      console.error('Profile fetch error:', err)
      // Clear invalid token
      localStorage.removeItem('token')
      setToken(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  // Register user
  const register = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/users/register', { email, password })
      const { token: newToken, user: userData } = res.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true, user: userData }
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Registration failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/users/login', { email, password })
      const { token: newToken, user: userData } = res.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true, user: userData }
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Login failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      await api.get('/users/logout')
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      return { success: true }
    } catch (err) {
      console.error('Logout error:', err)
      // Still clear local state even if API call fails
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    setError
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
