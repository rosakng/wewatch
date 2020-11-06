const { initializeRoom, likeEvent, dislikeEvent } = require('./redis.repository');
const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
const hgetAsync = promisify(client.hget).bind(client);
const hgetallAsync = promisify(client.HGETALL).bind(client);
const flushallAsync = promisify(client.flushall).bind(client);

/* 
    Test Class for redis.repository.js file consisting of unit tests for individual functions and integration tests with Redis.
    Tests will only run if local Redis server running. 
*/

afterEach(() => {
    jest.clearAllMocks();
});

describe('initializeRoom() Tests', () => {
    test('Should create key/value with appropriate headings.', async () => {
        return initializeRoom('abc', 7, [{'id': 123}, {'id': 234}]).then(async (numFields) => {
            expect(numFields).toStrictEqual(5);
            let obj = await hgetallAsync('abc');
            expect(obj.numUsers).toStrictEqual("7");
            expect(obj.total_swipes).toStrictEqual("0");
            expect(obj.numMovies).toStrictEqual("2");
            expect(obj['123']).toStrictEqual("0");
            expect(obj['234']).toStrictEqual("0");
            return flushallAsync();
        });
    });

    test('Should return error if fields null.', async () => {
        return initializeRoom(null, null, [{'id': 123}, {'id': 234}]).catch( async (error) => {
            expect(error).toStrictEqual('Fields were passed in that were null.');
            let obj = await hgetallAsync('abc');
            expect(obj).toStrictEqual(null);
            return flushallAsync();
        });
    });
})

describe('likeEvent() Tests', () => {
    test('Should increment like counter for appropriate movie.', async () => {
        return initializeRoom('abc', 2, [{'id': 123}, {'id': 234}]).then(async () => {
            await likeEvent('abc', 234).then(async(res) => {
                expect(res).toStrictEqual(-1);
                let like_count = await hgetAsync('abc', 234);
                expect(like_count).toStrictEqual("1");
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("1");
                return flushallAsync();
            });
        });
    });

    test('Should return error if fields null.', async () => {
        return initializeRoom('abc', 2, [{'id': 123}, {'id': 234}]).then(async () => {
            await likeEvent(null, null).catch(async(error) => {
                expect(error).toStrictEqual('Fields were passed in that were null.');
                let like_count = await hgetAsync('abc', 234);
                expect(like_count).toStrictEqual("0");
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("0");
                return flushallAsync();
            });
        });
    });

    test('Should return correct result if match found.', async () => {
        return initializeRoom('abc', 1, [{'id': 123}, {'id': 234}]).then(async () => {
            await likeEvent('abc', 123).then(async(res) => {
                expect(res).toStrictEqual(0);
                let like_count = await hgetAsync('abc', 123);
                expect(like_count).toStrictEqual("1");
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("1");
                return flushallAsync();
            });
        });
    });

    test('Should return correct result if swiping completed.', async () => {
        return initializeRoom('abc', 2, [{'id': 123}, {'id': 234}]).then(async () => {
            await likeEvent('abc', 123).then(async(res) => {
                expect(res).toStrictEqual(-1);
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("1");
            }); 
            await dislikeEvent('abc', 123); 
            await dislikeEvent('abc', 234); 
            await likeEvent('abc', 234).then(async(res) => {
                expect(res).toStrictEqual(1);
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("4");
                return flushallAsync();
            });                
        });
    });
});

describe('dislikeEvent() Tests', () => {
    test('Should increment total_swipes.', async () => {
        return initializeRoom('abc', 2, [{'id': 123}, {'id': 234}]).then(async () => {
            await dislikeEvent('abc', 234).then(async(res) => {
                expect(res).toStrictEqual(-1);
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("1");
                return flushallAsync();
            });
        });
    });

    test('Should return error if fields null.', async () => {
        return initializeRoom('abc', 2, [{'id': 123}, {'id': 234}]).then(async () => {
            await dislikeEvent(null, null).catch(async(error) => {
                expect(error).toStrictEqual('Room ID was empty or null.');
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("0");
                return flushallAsync();
            });
        });
    });

    test('Should return correct result if swiping completed.', async () => {
        return initializeRoom('abc', 2, [{'id': 123}, {'id': 234}]).then(async () => {
            await likeEvent('abc', 123);
            await likeEvent('abc', 234);
            await dislikeEvent('abc', 123).then(async(res) => {
                expect(res).toStrictEqual(-1);
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("3");
            }); 
            await dislikeEvent('abc', 234).then(async(res) => {
                expect(res).toStrictEqual(1);
                let swipe_count = await hgetAsync('abc', 'total_swipes');
                expect(swipe_count).toStrictEqual("4");
                return flushallAsync();
            });
        });
    });
});
