const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient();
const hgetAsync = promisify(client.hget).bind(client);
const hincrbyAsync = promisify(client.hincrby).bind(client);
const hsetAsync = promisify(client.hset).bind(client);

/**
 * Creates a room key in Redis and sets:
 *      1. the number of movies
 *      2. the number of guests
 *      3. the number of total swipes to 0
 * 
 * @param {String} roomId - The room ID.
 * @param {Integer} numGuests - The number of guests in the room, including the host
 * @param {Object[]} movies - The list of movies with the respective movie Ids
 * @returns {Integer} x - Number of fields sets (No errors if greater than 0)
 */
const initializeRoom = async (roomId, numGuests, movies) => {
    if(!roomId || !movies || !numGuests) {
        return Promise.reject('Fields were passed in that were null.')
    }
    let roomArgs = ["numUsers", numGuests, "total_swipes", 0, "numMovies", movies.length];
    movies.forEach(element => {
        roomArgs.push(element.id);
        roomArgs.push(0);
    });
    return await hsetAsync(roomId, roomArgs);
}

/**
 * Increments total_swipes and number of likes for movie. Also checks if match or if swiping completed. 
 * 
 * @param {String} roomId - The room ID.
 * @param {Integer} movie - Movie ID
 * @returns {Integer} 0 - If match found for movie ID passed in.
 * @returns {Integer} 1 - If no match found but swiping completed. 
 * @returns {Integer} -1 - If no match found and swiping not completed. 
 */
const likeEvent = async (roomId, movie) => {
    if(!roomId || !movie) {
        return Promise.reject('Fields were passed in that were null.')
    }
    const total_swipes = await hincrbyAsync(roomId, "total_swipes", 1);
    const movie_likes = await hincrbyAsync(roomId, movie, 1);

    const num_guests = await hgetAsync(roomId, "numUsers");
    const num_movies = await hgetAsync(roomId, "numMovies");

    if (movie_likes === parseInt(num_guests)) {
        return 0;
    } else if (swipingCompleted(total_swipes, parseInt(num_guests), parseInt(num_movies))) {
        return 1;
    }
    return -1;
}

/**
 * Increments total_swipes and checks if swiping completed. 
 * 
 * @param {String} roomId - The room ID.
 * @returns {Integer} 1 - If swiping completed. 
 * @returns {Integer} -1 - If swiping not completed.
 */
const dislikeEvent = async (roomId) => {
    if(!roomId) {
        return Promise.reject('Room ID was empty or null.')
    }

    const total_swipes = await hincrbyAsync(roomId, "total_swipes", 1);
    const num_movies = await hgetAsync(roomId, "numMovies");
    const num_guests = await hgetAsync(roomId, "numUsers");
    if (swipingCompleted(total_swipes, parseInt(num_guests), parseInt(num_movies))) {
        return 1;
    }
    return -1;
}

/**
 * Private function to validate if swiping is completed for room. 
 * 
 * @param {Integer} total_swipes - Total swipes in the room by all guests.
 * @param {Integer} num_guests - Total number of guests in the room.
 * @param {Integer} num_movies - Total number of movies in the room.
 * @returns {Boolean} Returns true if swiping has completed, otherwise returns false.
 */
const swipingCompleted = (total_swipes, num_guests, num_movies) => {
    if(total_swipes === num_guests * num_movies) {
        return true;
    } else {
        return false;
    }
}

module.exports = { initializeRoom, likeEvent, dislikeEvent };
