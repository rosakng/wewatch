const axios = require('axios')
const RapidapiClient = require('./rapidapiClient')

jest.mock('axios');

describe('get top 10 tests', () => {
    
    test('should fetch last 10 movies', () => {
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

    