const config = require('../config');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        config.TwitterClient.post('friendships/create', null, {user_id: twitterId, follow: false})
        .then((result) => {
            console.log("follow: " + result.id_str);
            resolve();
        })
        .catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}