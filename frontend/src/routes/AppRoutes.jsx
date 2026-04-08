import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import { UserProvider } from '../context/user.context'
import { ProjectProvider } from '../context/project.context'
import { SocketProvider } from '../context/socket.context'
import Home from '../screens/Home'
import ProtectedRoute from '../components/ProtectedRoute'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <SocketProvider>
          <ProjectProvider>
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute><div>Profile Page</div></ProtectedRoute>} />
            <Route path="/register" element={<Register />} />
          </Routes>
          </ProjectProvider>
        </SocketProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default AppRoutes