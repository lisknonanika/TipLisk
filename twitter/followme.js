const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(){
    config.TwitterClient.get('application/rate_limit_status', params, (error, result, response) => {
        if (!error) {
            console.log(result.resources);
        }
    });
}