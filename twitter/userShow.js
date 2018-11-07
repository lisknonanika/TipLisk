const config = require('../config');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        show(twitterId)
        .then((result) => {resolve(result)})
        .catch((err) => {reject(err)});
    });
}

var show = function(twitterId){
    return new Promise(function(resolve, reject){
        config.TwitterClient.get('application/rate_limit_status', {resources: "users"})
        .then((result) => {
            console.log(result.resources.users['/users/show/:id']);
            if (result.resources.users['/users/show/:id'].remaining < 100) return;
            config.TwitterClient.get('users/show/:id', {user_id: twitterId})
            .then((result) => {
                console.log(`show: id:${result.id_str} name:${result.screen_name}`);
                resolve(result);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });
}
