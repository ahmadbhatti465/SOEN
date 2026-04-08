import React, { useState } from 'react'
import { useProject } from '../context/project.context'
import Messaging from '../components/Messaging'
import AIChat from '../components/AIChat'

const Home = () => {
  const {
    projects,
    loading,
    error,
    success,
    createProject,
    addUserToProject,
    removeUserFromProject,
    fetchProjectById,
    updateProject,
    deleteProject
  } = useProject()

  // Create project modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Selected project - for left panel
  const [selectedProject, setSelectedProject] = useState(null)
  const [memberEmail, setMemberEmail] = useState('')
  const [addingMember, setAddingMember] = useState(false)
  const [memberError, setMemberError] = useState('')
  const [renameName, setRenameName] = useState('')

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!projectName.trim()) return
    setIsSubmitting(true)
    try {
      await createProject(projectName)
      setProjectName('')
      setIsCreateModalOpen(false)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openProject = (project) => {
    setSelectedProject(project)
    setRenameName(project.name || '')
    setMemberEmail('')
    setMemberError('')
  }

  const closeProject = () => {
    setSelectedProject(null)
    setMemberEmail('')
    setMemberError('')
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!memberEmail.trim()) return
    setAddingMember(true)
    setMemberError('')
    try {
      const updated = await addUserToProject(selectedProject._id, memberEmail)
      setSelectedProject(updated)
      setMemberEmail('')
    } catch (err) {
      setMemberError(err.message || 'Failed to add member')
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (email) => {
    try {
      const updated = await removeUserFromProject(selectedProject._id, email)
      setSelectedProject(updated)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRename = async () => {
    const newName = renameName?.trim()
    if (!newName) return
    try {
      await updateProject(selectedProject._id, { name: newName })
      const refreshedResp = await fetchProjectById(selectedProject._id)
      const refreshed = refreshedResp.project || refreshedResp
      setSelectedProject(refreshed)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete project? This cannot be undone.')) return
    try {
      await deleteProject(selectedProject._id)
      closeProject()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT PANEL - Projects List or Project Details */}
      {!selectedProject ? (
        <div className="w-full lg:w-1/2 p-4 overflow-auto">
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md border border-green-300">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Projects</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              New Project
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center p-8">
              <i className="ri-loader-4-line animate-spin text-3xl text-blue-500"></i>
            </div>
          )}

          {projects.length === 0 && !loading && (
            <div className="text-center py-12">
              <i className="ri-folder-open-line text-5xl text-gray-300 mb-4 block"></i>
              <p className="text-gray-500">No projects yet. Create one to get started!</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => openProject(project)}
                className="p-4 border border-slate-300 rounded-md hover:shadow-lg transition-shadow cursor-pointer bg-white"
              >
                <h3 className="font-semibold text-gray-800 truncate">{project.name}</h3>
                <p className="text-xs text-gray-600 mt-2">
                  <i className="ri-team-line"></i> {project.users?.length || 1} member{project.users?.length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* LEFT PANEL - Project Details */
        <div className="w-full lg:w-1/2 bg-white border-r border-gray-200 p-4 overflow-auto flex flex-col">
          {/* Top Section - Project Title & Actions */}
          <div className="mb-4 pb-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
              <button
                onClick={closeProject}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            {/* Update & Delete Actions */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rename project"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
              />
              <button
                onClick={handleRename}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
              >
                Update
              </button>
            </div>
            <button
              onClick={handleDelete}
              className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
            >
              <i className="ri-delete-bin-line"></i> Delete Project
            </button>
          </div>

          {/* Members Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="ri-team-line"></i> Team Members ({selectedProject.users?.length || 1})
            </h3>
            <div className="bg-gray-50 rounded-md p-3 max-h-24 overflow-auto space-y-2">
              {selectedProject.users?.map((u) => (
                <div key={u._id || u.email} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                      <i className="ri-user-line"></i>
                    </div>
                    <span className="text-gray-700">{u.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(u.email)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Member Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="ri-add-circle-line"></i> Add Collaborator
            </h3>
            <form onSubmit={handleAddMember} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={addingMember}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={addingMember}
              >
                {addingMember ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-add-line"></i>}
              </button>
            </form>
            {memberError && <p className="text-red-600 text-xs mt-2">{memberError}</p>}
          </div>

          {/* Chat Section */}
          <div className="flex-1 min-h-0 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="ri-chat-3-line"></i> Project Chat
            </h3>
            <div className="flex-1 border border-gray-300 rounded-md overflow-hidden bg-white flex flex-col">
              <Messaging projectId={selectedProject._id} />
            </div>
          </div>
        </div>
      )}

      {/* RIGHT PANEL - Empty Placeholder */}
      {selectedProject && (
        <div className="hidden lg:flex lg:w-1/2 bg-white border-l border-gray-200 p-4 flex-col">
          <div className="h-full">
            <AIChat />
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="mb-6">
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line"></i>
                      Create Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home