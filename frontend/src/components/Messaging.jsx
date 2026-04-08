import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../context/socket.context'
import { useUser } from '../context/user.context'
import {
  fetchMessagesByProjectId,
  addOptimisticMessage,
  replaceOptimisticMessage,
  receiveMessage,
  setCurrentProject,
  clearError,
  clearMessages
} from '../store/slices/messageSlice'

const Messaging = ({ projectId }) => {
  const dispatch = useDispatch()
  const { messages, loading, error } = useSelector((state) => state.messages)
  const { user } = useUser()
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const { socket, joinProject, leaveProject, sendProjectMessage, on, off } = useSocket()
  const bottomRef = useRef(null)
  const hasJoinedRef = useRef(false)

  // Fetch initial messages when project changes
  useEffect(() => {
    if (!projectId) return

    dispatch(setCurrentProject(projectId))
    dispatch(fetchMessagesByProjectId(projectId))
  }, [projectId, dispatch])

  // Join socket room and listen for real-time messages
  useEffect(() => {
    if (!projectId || !socket) return

    // Join the project room
    if (!hasJoinedRef.current) {
      joinProject(projectId)
      hasJoinedRef.current = true
    }

    // Listen for new messages from socket (other users)
    const handleNewMessage = (msg) => {
      dispatch(receiveMessage(msg))
    }

    // Acknowledgement for messages sent by this client
    const handleAck = (ack) => {
      if (ack?.tempId) {
        dispatch(replaceOptimisticMessage({ tempId: ack.tempId, savedMessage: ack }))
      } else {
        dispatch(receiveMessage(ack))
      }
    }

    on('newMessage', handleNewMessage)
    on('messageAck', handleAck)

    return () => {
      off('newMessage', handleNewMessage)
      off('messageAck', handleAck)
      leaveProject(projectId)
      hasJoinedRef.current = false
      dispatch(clearMessages())
    }
  }, [projectId, socket, dispatch, joinProject, leaveProject, on, off])

  // Auto scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return

    const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const currentUserId = user?._id || user?.id

    const optimisticMessage = {
      _tempId: tempId,
      sender: { _id: currentUserId, email: user?.email },
      content: text,
      createdAt: new Date().toISOString(),
      pending: true
    }

    // Add optimistic message to UI
    dispatch(addOptimisticMessage({ tempId, message: optimisticMessage }))

    setSending(true)
    sendProjectMessage({ projectId, content: text, tempId })
    setText('')

    // Reset sending state after short delay
    setTimeout(() => setSending(false), 300)
  }

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(fetchMessagesByProjectId(projectId))
  }

  // Loading state
  if (loading && messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-2xl text-blue-500 mb-2 block"></i>
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-red-500 mb-3"></i>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((m, idx) => {
            const currentUserId = user?._id || user?.id
            const isMine = String(m.sender?._id) === String(currentUserId)
            const key = m._id || m._tempId || idx

            return (
              <div
                key={key}
                className={`text-sm animate-fadeIn flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-xs">
                  <div className="text-xs text-gray-600 font-medium mb-1">
                    {isMine ? 'You' : m.sender?.email}
                  </div>
                  <div
                    className={`rounded px-3 py-2 inline-block break-words ${
                      isMine
                        ? 'bg-green-100 text-gray-900 ml-auto'
                        : 'bg-blue-100 text-gray-900'
                    }`}
                  >
                    {m.content}
                    {m.pending && (
                      <span className="text-xs text-gray-400 ml-2"> • sending</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="border-t p-3 bg-white flex gap-2 items-end">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend(e)
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          rows="1"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          title="Send (Enter)"
        >
          {sending ? (
            <i className="ri-loader-4-line animate-spin"></i>
          ) : (
            <i className="ri-send-plane-2-line"></i>
          )}
        </button>
      </form>
    </div>
  )
}

export default Messaging
