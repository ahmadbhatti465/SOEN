import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js'
import {validationResult} from 'express-validator';

export const projectCreateController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email })
        const userId = loggedInUser._id
        const newProject = await projectService.createProject({
            name,
            userId
        });
        res.status(200).json(newProject)

    } catch (err) {
        console.log(err)
        return res.status(400).send(err.message)
    }
}

export const projectListController = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email })
        const userId = loggedInUser._id
        const projects = await projectService.getProjectsByUserId(userId)
        return res.status(200).json({ projects })
    } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
    }
}

export const projectGetController = async (req, res) => {
    try {
        const projectId = req.params.id
        const project = await projectService.getProjectById(projectId)
        if (!project) return res.status(404).json({ error: 'Project not found' })
        return res.status(200).json({ project })
    } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
    }
}

export const projectUpdateController = async (req, res) => {
    try {
        const projectId = req.params.id
        const updates = req.body
        const updated = await projectService.updateProject(projectId, updates)
        if (!updated) return res.status(404).json({ error: 'Project not found' })
        return res.status(200).json({ project: updated })
    } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
    }
}

export const projectDeleteController = async (req, res) => {
    try {
        const projectId = req.params.id
        await projectService.deleteProject(projectId)
        return res.status(200).json({ success: true })
    } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
    }
}

export const projectAddUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email } = req.body
        const projectId = req.params.id

        const userToAdd = await userModel.findOne({ email })
        if (!userToAdd) return res.status(404).json({ error: 'User not found' })

        const updatedProject = await projectService.addUserToProject({ projectId, userId: userToAdd._id })
        return res.status(200).json({ project: updatedProject })
    } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
    }
}

export const getAllProjectController = async (req,res)=>{
    
}

export const projectRemoveUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email } = req.body
        const projectId = req.params.id

        const userToRemove = await userModel.findOne({ email })
        if (!userToRemove) return res.status(404).json({ error: 'User not found' })

        const updatedProject = await projectService.removeUserFromProject({ projectId, userId: userToRemove._id })
        return res.status(200).json({ project: updatedProject })
    } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
    }
}