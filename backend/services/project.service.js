import projectmodel from '../models/project.model.js';

export const createProject = async ({ name, userId }) => {
    if (!name) {
        throw new Error('Project name is required');
    }
    if (!userId) {
        throw new Error('User id is required');
    }
    const project = await projectmodel.create({
        name,
        users: [userId]
    });
    return project;
}

export const getProjectsByUserId = async (userId) => {
    if (!userId) throw new Error('User id is required');
    const projects = await projectmodel.find({ users: userId }).populate('users', 'email');
    return projects;
}

export const getProjectById = async (projectId) => {
    if (!projectId) throw new Error('Project id is required');
    const project = await projectmodel.findById(projectId).populate('users', 'email');
    return project;
}

export const updateProject = async (projectId, updates = {}) => {
    if (!projectId) throw new Error('Project id is required');
    const project = await projectmodel.findByIdAndUpdate(projectId, updates, { new: true }).populate('users', 'email');
    return project;
}

export const deleteProject = async (projectId) => {
    if (!projectId) throw new Error('Project id is required');
    await projectmodel.findByIdAndDelete(projectId);
    return true;
}

export const addUserToProject = async ({ projectId, userId }) => {
    if (!projectId) throw new Error('Project id is required');
    if (!userId) throw new Error('User id is required');

    const project = await projectmodel.findById(projectId);
    if (!project) throw new Error('Project not found');

    const already = project.users.some(u => u.toString() === userId.toString());
    if (already) {
        return project;
    }

    project.users.push(userId);
    await project.save();
    return await project.populate('users', 'email');
}

export const removeUserFromProject = async ({ projectId, userId }) => {
    if (!projectId) throw new Error('Project id is required');
    if (!userId) throw new Error('User id is required');

    const project = await projectmodel.findById(projectId);
    if (!project) throw new Error('Project not found');

    project.users = project.users.filter(u => u.toString() !== userId.toString());
    await project.save();
    return await project.populate('users', 'email');
}