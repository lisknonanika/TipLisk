const limitCtrlCollection = require('../mongo/limitCtrl');
const config = require('../config');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        limitCtrlCollection.update(config.twitter.follow.name)
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
                console.log(`follow: ${result.id_str}`);
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
