const axios = require('axios')
const RapidapiClient = require('./rapidapiClient')

jest.mock('axios');
jest.mock('../redis.repository');

const { checkCache, getCachedCall, cacheData } = require('../redis.repository');

// afterEach(() => {
//     jest.clearAllMocks();
// });

describe('API caching tests', () => {
    test('should fetch from API when URL not in cache', async () => {
        console.log('testing not in cache');
        checkCache.mockImplementation(() => 0);
        cacheData.mockImplementation(() => "OK");

        const resp = {data:"123"};
        axios.request.mockResolvedValue(resp);

        const result = await RapidapiClient.makeQuery('hello', {hi:'abc'});
        expect(result).toEqual('123');
        
    });

    test('should fetch from redis cache when URL is present', async () => {
        console.log('testing in cache');
        checkCache.mockImplementation(() => 1);

        const resp = JSON.stringify({data:'123'});
        getCachedCall.mockImplementation(() => resp);

        const result = await RapidapiClient.makeQuery('hello', {hi:'abc'});
        expect(result).toEqual({data: '123'});
    });
})

describe('get top 10 tests', () => {
    test('should fetch last 10 movies', () => {
        console.log('testing get top 10');
        checkCache.mockImplementation(() => 0);
        cacheData.mockImplementation(() => "OK");
        const movies = [
            {name: 'movie1'},
            {name: 'movie2'},
            {name: 'movie3'},
            {name: 'movie4'},
            {name: 'movie5'},
            {name: 'movie6'},
            {name: 'movie7'},
            {name: 'movie8'},
            {name: 'movie9'},
            {name: 'movie10'},
            {name: 'movie11'}]
        const last10 = movies.slice(-10)
        const resp = {data: {ITEMS: movies}};
        axios.request.mockResolvedValue(resp);
    
        return RapidapiClient.getTop10().then(data => expect(data).toEqual(last10));
    });
});

    