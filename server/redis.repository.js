const redis = require("redis");
const client = redis.createClient();


// on create room
const addRoomAndHost = (roomId, hostName) => {
    // create room key in Redis
    // set participant count to 1
}

// on guest joining room
const addGuestToRoom = (roomId, guestName) => {
    // increment participant count
}

// on get room data
const getRoom = (roomId) => {
    // return room data 
}

// on user dislikes movie
const dislikeEvent = () => {
    // decrement counter (for next sprint)
}

//on user likes movie
const likeEvent = () => {
    // increment counter for movie?
    // if match ? return movie id : return null or empty object
}

