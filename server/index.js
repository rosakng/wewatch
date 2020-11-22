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
const { initializeRoom, likeEvent, dislikeEvent, purgeRoom } = require('./redis.repository');

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

    socket.on('try_again_event', ({roomId}) => {
        console.log('try again event emitted');
        io.to(roomId).emit('tryAgainRedirectHost');
    });

    socket.on('tryAgainUser', ({oldRoomId, newRoomId}) => {
        io.to(oldRoomId).emit('tryAgainRedirectUser', {newRoomId:newRoomId})
        //purge previous room
        purgeRoom(oldRoomId).then((result) => {
            if(result) {
                console.log("previous room has been purged");
            }
        }).catch((error) => {
            console.log(`error on try again event to redis: ${error}`);
        })
    })

    // received signal to start a session from the host of a room, emit redirect signal to all guests and host
    socket.on('begin', ( user , callback) => {
        console.log('begin session signal received')

        // get list of top 10 movies to send to all guests of the room
        console.log('getting top 10')
        getTop10().then((top10) => {
            // TODO add call to redis to initialize swiping room here
            io.to(user.room).emit('sessionMembers', { roomId: user.room, users: getUsersInRoom(user.room), host: getHost(user.room), top10: top10});
        }).catch((error) => {
            console.log(`error getting list of top 10 movies from rapidapi: ${error}`)
            callback(error);
        });
        callback();
    });

     // received signal to start a session from the host of a room, emit redirect signal to all guests and host
     socket.on('initialize_room', ({roomId, numGuests, movies}) => {
        initializeRoom(roomId, numGuests, movies).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(`on initializing room, there was an error in redis: ${error}`);
        });
    });
    
    socket.on('match test', (movieId, user) => {
        console.log('match test initiated');
        console.log(movieId)
        console.log(user)
        // io.to(user.room).emit('match found', {movieId: movieId});
        io.to(user.room).emit('match found', {movieId: movieId});
    });

    socket.on('like_event', ({roomId, movieId, movieData}) => {
        likeEvent(roomId, movieId).then((result) => {
            if (result===0) {
                // initiate match page
                io.to(roomId).emit('matchRedirect', { matchedMovieId: movieId, matchedMovieData: movieData });
            }
            else if (result===1) {
                // initiate swiping completed with no match
                io.to(roomId).emit('noMatchRedirect')
            }
        }).catch((error) => {
            console.log(`error on like event to redis: ${error}`);
        });
    });

    socket.on('dislike_event', ({roomId}) => {
        dislikeEvent(roomId).then((result) => {
            if(result == 1) {
                // initiate swiping completed with no match
                io.to(roomId).emit('noMatchRedirect')
            }
        }).catch((error) => {
            console.log(`error on dislike event to redis: ${error}`);
        })
    });

    socket.on('try_again_event', ({roomId}) => {
        io.to(roomId).emit('tryAgainRedirectHost')
    });

    socket.on('tryAgainUser', ({oldRoomId, newRoomId}) => {
        io.to(oldRoomId).emit('tryAgainRedirectUser', {newRoomId:newRoomId})
        //purge previous room
        purgeRoom(oldRoomId).then((result) => {
            if(result) {
                console.log("previous room has been purged")
            }
        }).catch((error) => {
            console.log(`error on try again event to redis: ${error}`);
        })
    })
});

server.listen(PORT, () => {
    console.log('Server running on ' + PORT);
});
