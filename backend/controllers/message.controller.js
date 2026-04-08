import * as messageService from '../services/message.service.js';
import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js'

export const getProjectMessagesController = async (req, res) => {
  try {
    const projectId = req.params.id
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required', messages: [] })
    }
    const messages = await messageService.getMessagesByProject(projectId)
    return res.status(200).json({ messages: messages || [] })
  } catch (err) {
    console.error('Error fetching messages:', err.message)
    return res.status(500).json({ message: err.message || 'Failed to fetch messages', messages: [] })
  }
}

export const createMessageController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const projectId = req.params.id
    const { content } = req.body
    const loggedInUser = await userModel.findOne({ email: req.user.email })
    const senderId = loggedInUser._id
    const message = await messageService.createMessage({ projectId, senderId, content })
    return res.status(200).json({ message })
  } catch (err) {
    console.error(err)
    return res.status(400).send(err.message)
  }
}
