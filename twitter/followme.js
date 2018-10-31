const updateLimitCtrl = require('../mongo/updateLimitCtrl');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        updateLimitCtrl(config.twitter.follow.name)
        .then((remain) => {return follow(twitterId, remain)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var follow = function(twitterId, remain){
    return new Promise(function(resolve, reject){
        if(remain > 0) {
            config.TwitterClient.post('friendships/create', null, {user_id: twitterId, follow: false})
            .then((result) => {
                console.log("follow: " + result.id_str);
                resolve();
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
        } else {
            console.log("Limit: follow");
            reject("Limit: follow");
        }
    });
}
