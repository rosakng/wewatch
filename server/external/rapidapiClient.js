const axios = require("axios").default;
const { checkCache, getCachedCall, cacheData } = require('../redis.repository');
const { genreIndex } = require('./genres');

const getFromCache = async (requestUrl) => {
	try {
        const dataString = await getCachedCall(requestUrl);
        if (dataString !== null){
            return JSON.parse(dataString);
        }
        else { 
            console.log('getFromCache(): expected data, but found none');
            return null;
        }
	} catch (error) {
	    console.log(error)
	    return error
	}
}

const pushToRedis = async (requestUrl, data) => {
  // convert response object into JSON string, cache data in redis
  const dataString = JSON.stringify(data);
  return await cacheData(requestUrl, dataString);
}


/**
 * This function completes a request by checking redis to see if cached response for API call exists.
 * If it exists, this function returns the data as JSON. 
 * If it does not exist, this function will make the API call, then cache the result in redis for future use.
 * @param {String} requestUrl 
 * @param {Object} options 
 * @returns {Object} will always return the required data, either from cache or from API call
 */
const makeQuery = async (requestUrl, options) => {
    // check for existence of key
    try {
        const keyExists = await checkCache(requestUrl);
        if (keyExists === 1){
            console.log('makeQuery(): found cached version of API query')
            try {
                const data = await getFromCache(requestUrl);
                return data;
            } catch (error) {
                console.log(error);
                return error;
            }
        } 
        // data not in cache
        else {
            console.log('makeQuery(): key not in cache, calling API');
            try {
                // make API call, then cache result for future use
                const response = await axios.request(options);
                const pushstatus = await pushToRedis(requestUrl, response.data);
                console.log('makeQuery(): caching result ' + pushstatus);
                return response.data;
            } catch (error) {
                console.log(error);
                return error
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}


// this function makes an API call to the uNoGs unofficial netflix API, provided by rapidapi
// changing the parameters of the API call is difficult, consult the rapidapi platform
const getTop10 = async () => {
    let options = {
      method: 'GET',
      url: 'https://rapidapi.p.rapidapi.com/aaapi.cgi',
      params: {
        q: '-!1900,2020-!4,5-!6,10-!0-!Movie-!Any-!Any-!gt100-!{downloadable}',
        t: 'ns',
        cl: '33',
        st: 'adv',
        ob: 'Relevance',
        p: '1',
        sa: 'and'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'unogs-unogs-v1.p.rapidapi.com'
      }
    };

    // retain request URL to query redis or cache response in redis later
    const requestUrl = axios.getUri(options)

    try {
        const data = await makeQuery(requestUrl, options);
        top10 = data.ITEMS.slice(-10);
        return top10;
    } catch (error) {
        console.log(error);
        return error;
    }
}


// gets all genre IDs associated with each genre for more advanced filtering
const getGenreIds = async () => {
    let options = {
        method: 'GET',
        url: 'https://unogs-unogs-v1.p.rapidapi.com/api.cgi',
        params: {t: 'genres'},
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'unogs-unogs-v1.p.rapidapi.com'
        }
    }

    // retain request URL to query redis or cache response in redis later
    const requestUrl = axios.getUri(options)

    try {
        const data = await makeQuery(requestUrl, options);
        const items = data.ITEMS;
        console.log(items);

        let genreIds = {};

        // all
        genreIds.all = [0];

        // action
        genreIds.action = items[genreIndex.action]['All Action'];

        // anime
        genreIds.anime = items[genreIndex.anime]['All Anime'];

        // childrens
        genreIds.childrens = items[genreIndex.childrens]['All Childrens'];

        // classics
        genreIds.classics = items[genreIndex.classics]['All Classics'];

        // comedies
        genreIds.comedies = items[genreIndex.comedies]['All Comedies'];

        // documentaries
        genreIds.documentaries = items[genreIndex.documentaries]['All Documentaries'];

        // dramas
        genreIds.dramas = items[genreIndex.dramas]['All Dramas'];

        // horror
        genreIds.horror = items[genreIndex.horror]['All Horror'];

        // independent
        genreIds.independent = items[genreIndex.independent]['All Independent'];

        // romance 
        genreIds.romance = items[genreIndex.romance]['All Romance'];

        // sci-fi
        genreIds.sci_fi = items[genreIndex.sci_fi]['All Sci-Fi'];

        // thriller
        genreIds.thriller = items[genreIndex.thriller]['All Thrillers'];

        console.log(genreIds);

        return genreIds;

    } catch (error) {
        console.log(error)
        return error;
    }
}

const getFiltered = async (genreId, minIrate, maxIrate, minNrate, maxNrate) => {
    try {
        let options = {
            method: 'GET',
            url: 'https://rapidapi.p.rapidapi.com/aaapi.cgi',
            params: {
            q: `-!1900,2020-!${minNrate},${maxNrate}-!${minIrate},${maxIrate}-!${genreId}-!Movie-!Any-!Any-!gt10000-!{downloadable}`,
            t: 'ns',
            cl: '33',
            st: 'adv',
            ob: 'Relevance',
            p: '1',
            sa: 'and'
            },
            headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'unogs-unogs-v1.p.rapidapi.com'
            }
        };
    
        // retain request URL to query redis or cache response in redis later
        const requestUrl = axios.getUri(options)
    
        try {
            // return only the first 20 in the fetched list
            const data = await makeQuery(requestUrl, options);
            return data.ITEMS.slice(0, 20);
        } catch (error) {
            console.log(error);
            return error;
        }
    } catch (error) {
        console.log('error getting genres: ' + error)
        return error;
    }
}
module.exports = {getTop10, getFiltered, getGenreIds, makeQuery}

