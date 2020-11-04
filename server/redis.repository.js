const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient();
const hgetAsync = promisify(client.hget).bind(client);


// on host start
const initializeRoom = (roomId, numGuests, movies) => {
    let roomArgs = ["numUsers", numGuests, "total_swipes", 0];
    movies.forEach(element => {
        roomArgs.push(element.id);
        roomArgs.push(0);
    });

    client.hset(roomId, roomArgs, (err, res) => {
        if(err) {
            console.log("ERROR initializeRoom() " + err);
            return false;
        } else {
            return true;
        }
    });
}

// initializeRoom('abc', 7, [{id: 1}, {id: 2}]);

// on user likes movie
const likeEvent = (roomId, movie) => {
    client.hincrby(roomId, movie, 1, (err, res) => {
        if(err) {
            console.log("ERROR likeEvent() " + err);
        } 
    });

    client.hincrby(roomId, "total_swipes", 1, (err, res) => {
        if(err) {
            console.log("ERROR likeEvent() " + err);
            return false;
        } 
    });

    // if match ? return movie id
}

// likeEvent('abc', 1);

// on user dislikes movie
const dislikeEvent = (roomId) => {
    client.hincrby(roomId, "total_swipes", 1, (err, res) => {
        if(err) {
            console.log("ERROR dislikeEvent() " + err);
            return false;
        } else {
            return true;
        }
    });
}

// dislikeEvent('abc', 1);
const getTotal = async (roomId) => {
    const count = await hgetAsync(roomId, "total_swipes");
    return count;
}

// getTotal('abc').then((count) => {
//     console.log(count);
// });

module.exports = { initializeRoom, likeEvent, dislikeEvent, getTotal };