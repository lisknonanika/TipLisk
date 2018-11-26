const userCollection = require('../mongo/user');
const config = require('../config');
const util = require('../util');
const tweet = require('../twitter/tweet');
const lisk2jpy = require('../api/lisk2jpy');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        var tweetId = tweetInfo.id_str;
        var screenNm = tweetInfo.user.screen_name;
        var amount = "0";
        var commands = tweetInfo.text.match(config.regexp.balance)[0].trim().split(/\s/);
        var isJPY = (commands[1] !== "balance");
        userCollection.find({twitterId: twitterId})
        .then((result) => {
            amount = !result? "0": result.amount;
            if (isJPY) return lisk2jpy(amount)
        })
        .then((jpy) => {
            var params = [`${amount}LSK`];
            if (isJPY) params = [`${amount}LSK（約${jpy}円）`];
            return tweet(util.getMessage(config.message.balance, params), tweetId, screenNm)
        })
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "] Main");
            console.log(err);
            reject(err);
        });
    });
}
