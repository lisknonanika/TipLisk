const config = require('../config');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        config.TwitterClient.post('friendships/create', {user_id: twitterId, follow: false}, (error, result, response) => {
            if (!error) {
                console.log("follow: " + result.id_str);
                resolve();
            } else {
                console.log(error);
                reject(error);
            }
        });
    });
}