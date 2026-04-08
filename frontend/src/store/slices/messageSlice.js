import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Async thunks
export const fetchMessagesByProjectId = createAsyncThunk(
  'messages/fetchByProjectId',
  async (projectId, { rejectWithValue }) => {
    try {
      if (!projectId) {
        throw new Error('Project ID is required')
      }
      const response = await api.get(`/projects/${projectId}/messages`)
      return response.data.messages || response.data || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const sendMessage = createAsyncThunk(
  'messages/send',
  async ({ projectId, content }, { rejectWithValue }) => {
    try {
      if (!projectId || !content) {
        throw new Error('Project ID and content are required')
      }
      const response = await api.post(`/projects/${projectId}/messages`, { content })
      return response.data.message || response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Initial state
const initialState = {
  messages: [],
  currentProjectId: null,
  loading: false,
  error: null,
  success: null,
  optimisticMessages: {}, // Track temp IDs for optimistic updates
  lastUpdated: null
}

// Message slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Set current project to load messages for
    setCurrentProject: (state, action) => {
      state.currentProjectId = action.payload
      state.messages = []
    },

    // Add message locally (for optimistic UI or real-time)
    addMessageLocal: (state, action) => {
      const message = action.payload
      // Avoid duplicates
      const exists = state.messages.some(
        m => (m._id && m._id === message._id) || (m._tempId && m._tempId === message._tempId)
      )
      if (!exists) {
        state.messages.push(message)
        state.lastUpdated = Date.now()
      }
    },

    // Add optimistic message with temporary ID
    addOptimisticMessage: (state, action) => {
      const { tempId, message } = action.payload
      state.optimisticMessages[tempId] = true
      state.messages.push(message)
      state.lastUpdated = Date.now()
    },

    // Replace optimistic message with real one after server confirmation
    replaceOptimisticMessage: (state, action) => {
      const { tempId, savedMessage } = action.payload
      const index = state.messages.findIndex(m => m._tempId === tempId)
      if (index !== -1) {
        state.messages[index] = savedMessage
        delete state.optimisticMessages[tempId]
        state.lastUpdated = Date.now()
      }
    },

    // Clear all messages
    clearMessages: (state) => {
      state.messages = []
      state.optimisticMessages = {}
      state.currentProjectId = null
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Clear success
    clearSuccess: (state) => {
      state.success = null
    },

    // Receive message from socket (real-time from other users)
    receiveMessage: (state, action) => {
      const message = action.payload
      const exists = state.messages.some(m => m._id === message._id)
      if (!exists) {
        state.messages.push(message)
        state.lastUpdated = Date.now()
      }
    }
  },

  extraReducers: (builder) => {
    // Fetch messages
    builder
      .addCase(fetchMessagesByProjectId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessagesByProjectId.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
        state.lastUpdated = Date.now()
        state.error = null
      })
      .addCase(fetchMessagesByProjectId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.messages = []
      })

    // Send message (via API - normally handled via socket)
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = false // Don't block UI on send
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          m => m._tempId === action.payload._tempId
        )
        if (index !== -1) {
          state.messages[index] = action.payload
          delete state.optimisticMessages[action.payload._tempId]
        }
        state.success = 'Message sent successfully'
        state.lastUpdated = Date.now()
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const {
  setCurrentProject,
  addMessageLocal,
  addOptimisticMessage,
  replaceOptimisticMessage,
  clearMessages,
  clearError,
  clearSuccess,
  receiveMessage
} = messageSlice.actions

export default messageSlice.reducer
