const userCollection = require('../mongo/user');
const config = require('../config');
const util = require('../util');
const tweet = require('../twitter/tweet');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        var tweetId = tweetInfo.id_str;
        var screenNm = tweetInfo.user.screen_name;
        userCollection.find({twitterId: twitterId})
        .then((result) => {return tweet(util.getMessage(config.message.balance, [!result? "0": result.amount]), tweetId, screenNm)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}
