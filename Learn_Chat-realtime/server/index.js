const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
    },
});

io.on('connection', (socket) => {
    socket.on('join-room', (data) => {
        socket.join(data.room);
        console.log(`${data.name} joined room ${data.room}`);
    });
    socket.on('send-message', (data) => {
        console.log('🚀 ~ file: index.js:23 ~ socket.on ~ data:', data);
        socket
            .to(data.room)
            .emit('receive-message', { ...data, id: socket.id });
    });
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});
server.listen(3000, () => {
    console.log('Server running on port 3000...');
});
