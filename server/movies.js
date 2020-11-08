const rapidapi = require('./external/rapidapiClient')

const getTop10 = () => {
    console.log('forwarding to rapidapiclient.js')
    return rapidapi.getTop10()
}

module.exports = {getTop10}