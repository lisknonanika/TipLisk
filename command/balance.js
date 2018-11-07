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
        .then((result) => {
            var balance = !result? "0": util.num2str(result.amount);
            return tweet(util.getMessage(config.message.balance, [balance]), tweetId, screenNm)
        })
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}
