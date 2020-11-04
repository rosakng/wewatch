const axios = require("axios").default;

// this function makes an API call to the uNoGs unofficial netflix API, provided by rapidapi
// changing the parameters of the API call is difficult, consult the rapidapi platform
const getTop10 = () => {

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
    
    console.log('calling')
    
    return axios.request(options).then((response) => {
      console.log('received response, formatting')
      top10 = response.data.ITEMS.slice(-10)
      console.log(top10)
      return top10
    }).catch(function (error) {
      console.error(error);
    });
}

module.exports = {getTop10}

