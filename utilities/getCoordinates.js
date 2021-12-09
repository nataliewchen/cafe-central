const axios = require('axios');

// forward geocoding api
module.exports = async(loc) => {
    const params = {
        access_key: process.env.POSITIONSTACK_KEY,
        query: loc
    };
    const response = await axios.get('http://api.positionstack.com/v1/forward', {params});
    // coordinates of the location search query
    // will be used to calculate distances with potential cafe matches
    const start = {
        latitude: response.data.data[0].latitude,
        longitude: response.data.data[0].longitude
    }
    return start;
}