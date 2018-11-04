const userCollection = require('../mongo/user');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId, tweetId, screenNm){
    return new Promise(function(resolve, reject){
        userCollection.find({twitterId: twitterId})
        .then((result) => {
            var balance = !result? "0": util.num2str(result.amount);
            return tweet(util.getMessage(config.message.balance, [balance]), tweetId, screenNm)
        })
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}
