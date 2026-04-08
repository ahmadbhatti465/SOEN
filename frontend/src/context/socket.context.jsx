import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
    const socket = io(API_BASE, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected successfully')
      setConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket authentication/connection error:', err.message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const joinProject = (projectId) => {
    socketRef.current?.emit('joinProject', projectId)
  }

  const leaveProject = (projectId) => {
    socketRef.current?.emit('leaveProject', projectId)
  }

  const sendProjectMessage = (payload) => {
    socketRef.current?.emit('projectMessage', payload)
  }

  const on = (event, cb) => socketRef.current?.on(event, cb)
  const off = (event, cb) => socketRef.current?.off(event, cb)

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinProject, leaveProject, sendProjectMessage, on, off }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}
