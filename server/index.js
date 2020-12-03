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

const { addUser, addHost, removeUser, getUsersInRoom, getHost, getRooms } = require('./users');
const { getTop10, getFiltered, getGenreIds } = require('./external/rapidapiClient');
const { initializeRoom, likeEvent, dislikeEvent, purgeRoom } = require('./redis.repository');

io.on('connection', (socket) => {
    // When a user disconnects from the socket, remove the user from the room and update the guest list
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room), host: getHost(user.room) });
        }
    });

    socket.on('create', async ({ name }, callback) => {
        console.log('create request received')
        const { error, user } = addHost({ id: socket.id, name });

        if (error) return callback(error);

        socket.join(user.room);
        try {
            const genreIds = await getGenreIds(); 
            io.to(user.room).emit('roomCreation', { room: user.room, users: getUsersInRoom(user.room), host: getHost(user.room), genreIds: genreIds});
        } catch (error) {
            console.log(error)
            callback(error)
        }
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
    socket.on('begin', async (user, filters, callback) => {
        console.log('begin session signal received')
        try {
            const movieList = await getFiltered(filters.genreId, filters.minIrate, filters.maxIrate, filters.minNrate, filters.maxNrate);
            io.to(user.room).emit('sessionMembers', { roomId: user.room, users: getUsersInRoom(user.room), host: getHost(user.room), movieList: movieList});
        } catch (error) {
            console.log(`error getting filtered list of movies from rapidapi: ${error}`)
            callback(error);
        }

        callback();
    });

     // received signal to start a session from the host of a room, emit redirect signal to all guests and host
     socket.on('initialize_room', ({roomId, numGuests, movies}) => {
        initializeRoom(roomId, numGuests, movies).then((result) => {
            console.log('initialize room result: ' + result);
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

app.get('/getRoom', (req, res) => res.send(getRooms()))

server.listen(PORT, () => {
    console.log('Server running on ' + PORT);
});
