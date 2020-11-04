const redis = require("redis");
const client = redis.createClient();

// on host start
const initializeRoom = (roomId, numGuests, movies) => {
    // create room key in Redis
    // add total number of users in room
    // add movies (room:movieId = 0)
    // set total swipes to 0
}

// on user likes movie
const likeEvent = (movie) => {
    // increment counter for movie (INCR room:movieId)
    // increment total swipes
    // if match ? return movie id
}

// on user dislikes movie
const dislikeEvent = (movie) => {
    // increment total swipes
    // decrement counter (for next sprint)
}

const checkCompleted = () => {
    // return total_swipes
}

module.exports = { initializeRoom, likeEvent, dislikeEvent, checkCompleted };