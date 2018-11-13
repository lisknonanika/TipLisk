const userCollection = require('../mongo/user');
const config = require('../config');
const util = require('../util');
const tweet = require('../twitter/tweet');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        var tweetId = tweetInfo.id_str;
        var screenNm = tweetInfo.user.screen_name;
        var amount = "0";
        userCollection.find({twitterId: twitterId})
        .then((result) => {
            amount = !result? "0": result.amount;
            return lisk2jpy(amount)
        })
        .then((jpy) => {return tweet(util.getMessage(config.message.balance, [amount, jpy]), tweetId, screenNm)})
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "]" + err);
            reject(err);
        });
    });
}
