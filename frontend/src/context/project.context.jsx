import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../api/axios'
import { useUser } from './user.context'

const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
  const { token, isAuthenticated } = useUser()
  
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Fetch all projects for the logged-in user
  const fetchProjects = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/projects', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects(response.data.projects || response.data)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err.response?.data?.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  // Fetch a single project by ID
  const fetchProjectById = async (projectId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCurrentProject(response.data.project || response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching project:', err)
      setError(err.response?.data?.message || 'Failed to fetch project')
    } finally {
      setLoading(false)
    }
  }

  // Messages management for the current project
  const fetchMessagesByProject = async (projectId) => {
    if (!projectId) {
      setMessages([])
      return []
    }
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/projects/${projectId}/messages`)
      if (!response.data) {
        throw new Error('No data received from server')
      }
      const msgs = Array.isArray(response.data.messages) ? response.data.messages : Array.isArray(response.data) ? response.data : []
      setMessages(msgs)
      return msgs
    } catch (err) {
      console.error('Error fetching messages:', err.message || err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load messages'
      setError(errorMsg)
      setMessages([])
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addMessageLocal = (msg) => {
    setMessages((prev) => [...prev, msg])
  }

  const replaceMessageByTempId = (tempId, savedMsg) => {
    if (!tempId) return
    setMessages((prev) => prev.map((m) => (m._tempId && m._tempId === tempId ? savedMsg : m)))
  }

  const clearMessages = () => setMessages([])

  // Create a new project
  const createProject = async (projectName) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await api.post('/projects/create', 
        { name: projectName },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const newProject = response.data
      setProjects([...projects, newProject])
      setSuccess('Project created successfully!')
      setTimeout(() => setSuccess(null), 3000)
      return newProject
    } catch (err) {
      console.error('Error creating project:', err)
      const errorMsg = err.response?.data?.message || 'Failed to create project'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Update a project
  const updateProject = async (projectId, updates) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await api.put(`/projects/${projectId}`, 
        updates,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const updatedProject = response.data.project || response.data
      
      // Update in projects array
      setProjects(projects.map(p => p._id === projectId ? updatedProject : p))
      
      // Update current project if it's the one being edited
      if (currentProject?._id === projectId) {
        setCurrentProject(updatedProject)
      }
      
      setSuccess('Project updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
      return updatedProject
    } catch (err) {
      console.error('Error updating project:', err)
      const errorMsg = err.response?.data?.message || 'Failed to update project'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Delete a project
  const deleteProject = async (projectId) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await api.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setProjects(projects.filter(p => p._id !== projectId))
      
      // Clear current project if deleted
      if (currentProject?._id === projectId) {
        setCurrentProject(null)
      }
      
      setSuccess('Project deleted successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error deleting project:', err)
      const errorMsg = err.response?.data?.message || 'Failed to delete project'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Add user to a project by email
  const addUserToProject = async (projectId, email) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await api.post(`/projects/${projectId}/add-user`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const updatedProject = response.data.project || response.data
      setProjects(projects.map(p => p._id === projectId ? updatedProject : p))
      if (currentProject?._id === projectId) setCurrentProject(updatedProject)
      setSuccess('User added to project')
      setTimeout(() => setSuccess(null), 3000)
      return updatedProject
    } catch (err) {
      console.error('Error adding user to project:', err)
      const errorMsg = err.response?.data?.message || 'Failed to add user to project'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Remove a user from project by email
  const removeUserFromProject = async (projectId, email) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await api.post(`/projects/${projectId}/remove-user`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const updatedProject = response.data.project || response.data
      setProjects(projects.map(p => p._id === projectId ? updatedProject : p))
      if (currentProject?._id === projectId) setCurrentProject(updatedProject)
      setSuccess('User removed from project')
      setTimeout(() => setSuccess(null), 3000)
      return updatedProject
    } catch (err) {
      console.error('Error removing user from project:', err)
      const errorMsg = err.response?.data?.message || 'Failed to remove user from project'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Clear error message
  const clearError = () => setError(null)

  // Clear success message
  const clearSuccess = () => setSuccess(null)

  // Fetch projects when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects()
    }
  }, [isAuthenticated])

  const value = {
    // State
    projects,
    currentProject,
    messages,
    loading,
    error,
    success,

    // Methods
    fetchProjects,
    fetchProjectById,
    fetchMessagesByProject,
    addMessageLocal,
    clearMessages,
    replaceMessageByTempId,
    createProject,
    updateProject,
    deleteProject,
    addUserToProject,
    removeUserFromProject,
    clearError,
    clearSuccess,
    setCurrentProject
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

// Custom hook to use Project Context
export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
