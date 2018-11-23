const config = require('./config');
const util = require('./util');
const userCollection = require('./mongo/user');
const mentionIdCollection = require('./mongo/mentionId');
const tip = require('./command/tip');
const balance = require('./command/balance');
const deposit = require('./command/deposit');
const withdraw = require('./command/withdraw');
const followme = require('./command/followme');
const history = require('./command/history');

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
            userCollection.update({twitterId: tweetInfo.user.id_str, amount: "0", noupd: true})     
            .then(() => {return mentionIdCollection.insertHistory(tweetInfo.id_str)})
            .then(() => {
                if (config.regexp.tip.test(tweetInfo.text)) return tip(tweetInfo, false);
                else if (config.regexp.tip_s.test(tweetInfo.text)) return tip(tweetInfo, true);
                else if (config.regexp.balance.test(tweetInfo.text)) return balance(tweetInfo);
                else if (config.regexp.deposit.test(tweetInfo.text)) return deposit(tweetInfo);
                else if (config.regexp.withdraw.test(tweetInfo.text)) return withdraw(tweetInfo);
                else if (config.regexp.followme.test(tweetInfo.text)) return followme(tweetInfo);
                else if (config.regexp.history.test(tweetInfo.text)) return history(tweetInfo);
            })
            .then(() => {resolve()})
            .catch((err) => {
                console.log("[" + util.getDateTimeString() + "]" + err);
                reject(err);
            });
        })
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "]" + err);
            reject(err);
        });
    });
}