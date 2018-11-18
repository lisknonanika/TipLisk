const config = require('../config');
const util = require('../util');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        show(twitterId)
        .then((result) => {resolve(result)})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "]" + err);
            reject(err);
        });
    });
}

var show = function(twitterId){
    return new Promise(function(resolve, reject){
        config.TwitterClient.get('application/rate_limit_status', {resources: "users"})
        .then((result) => {
            // console.log("[/users/show/:id] " + JSON.stringify(result.resources.users['/users/show/:id']));
            if (result.resources.users['/users/show/:id'].remaining < 100) {
                console.log("[" + util.getDateTimeString() + "] /users/show/:id limit");
                return;
            }
            config.TwitterClient.get('users/show/:id', {user_id: twitterId})
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                console.log("[" + util.getDateTimeString() + "]" + err);
                reject(err);
            });
        });
    });
}
