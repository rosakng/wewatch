const express = require('express');
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

require('dotenv').config()

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());

const { addUser, addHost, removeUser, getUsersInRoom, getHost } = require('./users');
const { getTop10 } = require('./movies');

io.on('connection', (socket) => {
    // When a user disconnects from the socket, remove the user from the room and update the guest list
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room), host: getHost(user.room) });
        }
    });

    socket.on('create', ({ name }, callback) => {
        console.log('create request received')
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

    // received signal to start a session from the host of a room, emit redirect signal to all guests and host
    socket.on('begin', ( user , callback) => {
        console.log('begin session signal received')

        // get list of top 10 movies to send to all guests of the room
        console.log('getting top 10')
        getTop10().then((top10) => {
            // TODO add call to redis to initialize swiping room here
            io.to(user.room).emit('sessionMembers', { room: user.room, users: getUsersInRoom(user.room), host: getHost(user.room), top10: top10});
        }).catch((error) => {
            console.log('error getting list of top 10 movies from rapidapi')
            callback(error);
        });
        callback();
    });

    // test to see if receive signal from the same connection
    socket.on('emitting from swipe page, i am an imported socket', () => {
        console.log('successfully received emit from same connection in swiping room')
    } )
});

server.listen(PORT, () => {
    console.log('Server running on ' + PORT);
});
