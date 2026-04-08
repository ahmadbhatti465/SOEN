import { configureStore } from '@reduxjs/toolkit'
import messageReducer from './slices/messageSlice'

export const store = configureStore({
  reducer: {
    messages: messageReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['messages/fetchByProjectId/fulfilled', 'messages/send/fulfilled'],
        // Ignore these state paths for serialization check
        ignoredPaths: ['messages.lastUpdated']
      }
    })
})

export default store
