const express = require('express');
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { addUser, addHost, removeUser, getUsersInRoom, getHost } = require('./users');

io.on('connection', (socket) => {
    // When a user disconnects from the socket, remove the user from the room and update the guest list
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    });

    socket.on('create', ({ name }, callback) => {
        const { error, user } = addHost({ id: socket.id, name });

        if (error) return callback(error);

        socket.join(user.room);

        io.to(user.room).emit('roomCreation', { room: user.room, users: getUsersInRoom(user.room), host: getHost(user.room)});

        callback();

    });

    // When a user joins a room, add the user to the room and update the room list
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room), host: getHost(user.room)});

        callback();
    });
});

app.use(router);

server.listen(PORT, () => {
    console.log('Server running on ' + PORT);
});
