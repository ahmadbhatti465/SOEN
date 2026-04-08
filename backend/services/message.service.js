import Message from '../models/message.model.js';

export const createMessage = async ({ projectId, senderId, content }) => {
  if (!projectId) throw new Error('Project id is required');
  if (!senderId) throw new Error('Sender id is required');
  if (!content) throw new Error('Message content is required');

  const msg = await Message.create({ project: projectId, sender: senderId, content });
  return await msg.populate('sender', 'email');
}

export const getMessagesByProject = async (projectId, limit = 200) => {
  if (!projectId) throw new Error('Project id is required');
  const messages = await Message.find({ project: projectId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .populate('sender', 'email _id')
    .exec();
  return messages;
}
