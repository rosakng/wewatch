const axios = require("axios").default;
const { checkCache, getCachedCall, cacheData } = require('../redis.repository');


const getFromCache = async (requestUrl) => {
	try {
        const dataString = await getCachedCall(requestUrl);
        if (dataString !== null){
            const data = JSON.parse(dataString);
            return data;
        }
        else { 
            console.log('expected data, but found none');
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
            console.log('key exists in cache, checking now')
            try {
                const data = await getFromCache (requestUrl);
                return data;
            } catch (error) {
                console.log(error);
                return error;
            }
        } 
        // data not in cache
        else {
            console.log('key not in cache, calling API');
            try {
                // make API call, then cache result for future use
                console.log('making call')
                const response = await axios.request(options);
                const pushstatus = await pushToRedis(requestUrl, response.data);
                console.log('data cache: ' + pushstatus);
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

    console.log('setting up api call')

    var options = {
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
    console.log('built URI of the API request:')
    console.log(requestUrl);

    console.log('making query now');
    try {
        const data = await makeQuery(requestUrl, options);
        top10 = data.ITEMS.slice(-10);
        console.log(top10);
        return top10;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {getTop10, makeQuery}

