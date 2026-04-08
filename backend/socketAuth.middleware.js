import jwt from 'jsonwebtoken';

// Socket auth middleware: verifies JWT in handshake (auth.token or Authorization header)
export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1] || socket.handshake.headers?.cookie?.match(/token=([^;]+)/)?.[1];
    if (!token) return next(new Error('Authentication error: No token'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    return next();
  } catch (err) {
    console.error('Socket auth error', err);
    return next(new Error('Authentication error'));
  }
}

export default socketAuth;
