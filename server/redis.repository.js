const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient();
const hgetAsync = promisify(client.hget).bind(client);
const hincrAsync = promisify(client.hincrby).bind(client);
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
    const total_swipes = await hincrAsync(roomId, "total_swipes", 1);
    const movie_likes = await hincrAsync(roomId, movie, 1);

    const num_guests = await hgetAsync(roomId, "numUsers");
    const num_movies = await hgetAsync(roomId, "numMovies");

    console.log(total_swipes, movie_likes, parseInt(num_guests), parseInt(num_movies));

    if (movie_likes === parseInt(num_guests)) {
        return 0;
    } else if (total_swipes === parseInt(num_guests) * parseInt(num_movies)) {
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
    const total_swipes = await hincrAsync(roomId, "total_swipes", 1);
    const num_movies = await hgetAsync(roomId, "numMovies");
    const num_guests = await hgetAsync(roomId, "numUsers");
    if (total_swipes === parseInt(num_guests) * parseInt(num_movies)) {
        return 1;
    }
    return -1;
}

// Test
// initializeRoom('abc', 3, [{id: 1}, {id: 2}]).then((res) => {console.log(res);})

// Test
// likeEvent('abc', 1).then((res) => {console.log(res)});

// Test
// dislikeEvent('abc').then((res) => {console.log(res);});

module.exports = { initializeRoom, likeEvent, dislikeEvent };
