const redis = require("redis");
const client = redis.createClient();


const initializeRoom = (roomId, numGuests, movies) => {
    // when host starts
        // create room key in Redis
        // add total number of users in room
        // add movies (room:movieId = 0)
}

//on user likes movie
const likeEvent = () => {
    // on user likes movie
        // increment counter for movie (INCR room:movieId)
        // if match ? return movie id : return null or empty object
}

// on user dislikes movie
const dislikeEvent = () => {
    // decrement counter (for next sprint)
}

module.exports = { initializeRoom, likeEvent};