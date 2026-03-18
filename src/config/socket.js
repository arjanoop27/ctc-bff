const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const { env } = require('../config/env');

let io;

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:4200', 'http://localhost:3000'],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token = getTokenFromSocketHandshake(socket);
            if (!token) return next(new Error('Unauthorized: missing token'));

            const payload = jwt.verify(token, env.JWT_SECRET);

            socket.user = { userId: payload.userId };
            return next();
        } catch (err) {
            return next(new Error('Unauthorized: invalid/expired token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user.userId;

        socket.join(userId);
        console.log(`[socket] connected user=${userId} socket=${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`[socket] disconnected user=${userId} socket=${socket.id}`);
        });
    });

    return io;
}

function getIO() {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
}

function emitToUser(userId, event, payload) {
    if (!io) return;
    io.to(userId).emit(event, payload);
}

function getTokenFromSocketHandshake(socket) {
    const authToken = socket.handshake.auth?.token;
    if (authToken) return authToken;

    const rawCookie = socket.handshake.headers?.cookie;
    if (rawCookie) {
        const parsed = cookie.parse(rawCookie);
        if (parsed.access_token) return parsed.access_token;
    }

    const authHeader = socket.handshake.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return null;
}

module.exports = { initSocket, getIO, emitToUser };
