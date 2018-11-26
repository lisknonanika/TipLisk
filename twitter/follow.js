const limitCtrlCollection = require('../mongo/limitCtrl');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        limitCtrlCollection.update(config.twitter.follow.name)
        .then((remain) => {return follow(twitterId, remain)})
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "] Main");
            console.log(twitterId);
            console.log(err);
            reject(err);
        });
    });
}

var follow = function(twitterId, remain){
    return new Promise(function(resolve, reject){
        if(remain > 0) {
            config.TwitterClient.post('friendships/create', null, {user_id: twitterId, follow: false})
            .then((result) => {
                resolve();
            })
            .catch((err) => {
                console.log("[" + util.getDateTimeString() + "] follow");
                console.log(twitterId);
                console.log(err);
                reject(err);
            });
        } else {
            reject("Limit: follow");
        }
    });
}
