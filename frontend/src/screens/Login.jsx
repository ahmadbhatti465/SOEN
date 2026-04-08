import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/user.context'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login, loading } = useUser()
  const { isAuthenticated } = useUser()

  // Redirect away if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const result = await login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-pink-500 rounded-full text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-700">Welcome back</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="sr-only">Email</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 008 0z" />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="mb-4 relative">
            <label className="sr-only">Password</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1.657 0-3 .895-3 2v3h6v-3c0-1.105-1.343-2-3-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11V9a5 5 0 10-10 0v2" />
              </svg>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="inline-flex items-center text-sm text-gray-600">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
              <span className="ml-2">Remember me</span>
            </label>
            <button type="button" className="text-sm text-indigo-600 hover:underline">Forgot password?</button>
          </div>

          {error && <div className="text-red-600 mb-4">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow"
          >
            {loading ? 'Logging in...' : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4z" clipRule="evenodd" />
                  <path d="M13 7l3 3m0 0l-3 3m3-3H9" />
                </svg>
                <span>Sign in</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register</Link></p>
      </div>
    </div>
  )
}

export default Login