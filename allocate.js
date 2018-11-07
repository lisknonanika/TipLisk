const config = require('./config');
const mentionIdCollection = require('./mongo/mentionId');
const tip = require('./command/tip');
const balance = require('./command/balance');
const deposit = require('./command/deposit');
const withdraw = require('./command/withdraw');
const followme = require('./command/followme');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        // check blacklist or retweet
        if (config.blacklist.indexOf(tweetInfo.user.id_str) >= 0 || tweetInfo.retweeted_status) {
            reject("not execute");
            return;
        }
        mentionIdCollection.find({flg:0, mentionId: tweetInfo.id_str})
        .then((result) => {
            if (result) {
                reject("already execute");
                return;
            }
            mentionIdCollection.insertHistory(tweetInfo.id_str)
            .then(() => {
                if (config.regexp.tip.test(tweetInfo.text)) return tip(tweetInfo, false);
                else if (config.regexp.tip_s.test(tweetInfo.text)) return tip(tweetInfo, true);
                else if (config.regexp.balance.test(tweetInfo.text)) return balance(tweetInfo);
                else if (config.regexp.deposit.test(tweetInfo.text)) return deposit(tweetInfo);
                else if (config.regexp.withdraw.test(tweetInfo.text)) return withdraw(tweetInfo);
                else if (config.regexp.followme.test(tweetInfo.text)) return followme(tweetInfo);
            })
            .then(() => {resolve()})
            .catch((err) => {reject(err)});
        })
        .catch((err) => {reject(err)});
    });
}