import 'dotenv/config.js'
import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import socketAuth from './socketAuth.middleware.js'
import * as messageService from './services/message.service.js'

const port = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const server = http.createServer(app);

// Attach socket.io
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        credentials: true
    },
    transports: ['websocket', 'polling']
});

io.use(socketAuth);

io.on('connection', (socket) => {
    console.log('✓ Socket connected:', socket.id, 'user:', socket.user?.email || socket.user?.id);

    socket.on('joinProject', (projectId) => {
        if (!projectId) return;
        socket.join(`project:${projectId}`);
    });

    socket.on('leaveProject', (projectId) => {
        if (!projectId) return;
        socket.leave(`project:${projectId}`);
    });

    socket.on('projectMessage', async (payload) => {
        try {
            const { projectId, content, tempId } = payload || {}
            const senderId = socket.user?.id || socket.user?._id;
            if (!senderId) throw new Error('Invalid sender');
            const saved = await messageService.createMessage({ projectId, senderId, content });

            // Send acknowledgement only to sender with tempId so frontend can replace optimistic message
            const ackPayload = { ...saved.toObject(), tempId };
            socket.emit('messageAck', ackPayload);

            // Broadcast the new message to other room members
            socket.to(`project:${projectId}`).emit('newMessage', saved);
        } catch (err) {
            console.error('projectMessage error', err);
            socket.emit('error', { message: err.message });
        }
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', socket.id, 'reason:', reason)
    });
});

server.listen(port, () => {
    console.log(`✓ Server is running on port ${port}`)
    console.log(`  Frontend URL: ${FRONTEND_URL}`)
})

// Handle server errors
server.on('error', (err) => {
    console.error('✗ Server error:', err.message)
})