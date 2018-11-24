const userCollection = require('../mongo/user');
const historyCollection = require('../mongo/history');
const tweet = require('../twitter/tweet');
const config = require('../config');
const lisk2jpy = require('../api/lisk2jpy');
const util = require('../util');

module.exports = function(tweetInfo, isReply) {
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        var replyId = tweetInfo.id_str;
        var screenName = tweetInfo.user.screen_name;
        var recipientId = "";
        var targetNm = "";
        var amount = "0";
        var isJPY = false;
        if (isReply) {
            var commands = tweetInfo.text.match(config.regexp.tip_s)[0].trim().split(/\s/);
            recipientId = tweetInfo.in_reply_to_user_id_str;
            targetNm = tweetInfo.in_reply_to_screen_name;
            amount = commands[2];
            isJPY = (commands[1] === "チップ");

        } else {
            var commands = tweetInfo.text.match(config.regexp.tip)[0].trim().split(/\s/);
            for (i = 0; i < tweetInfo.entities.user_mentions.length; i++) {
                if (tweetInfo.entities.user_mentions[i].screen_name.toUpperCase() === commands[2].substring(1).toUpperCase()) {
                    recipientId = tweetInfo.entities.user_mentions[i].id_str;
                    break;
                }
            }
            targetNm = commands[2].substring(1);
            amount = commands[3];
            isJPY = (commands[1] === "チップ");
        }
        if (!recipientId) {
            console.log("[" + util.getDateTimeString() + "]recipientId not found");
            resolve();

        } else {
            userCollection.find({twitterId: twitterId})
            .then((result) => {return checkBalance(amount, !result? "0": result.amount, replyId, screenName)})
            .then(() => {return userCollection.update({twitterId: twitterId, amount: util.calc(amount, -1, "mul")})})
            .then(() => {return userCollection.update({twitterId: recipientId, amount: amount})})
            .then(() => {return historyCollection.insert({twitterId: twitterId, amount: amount, type: 0, targetNm: targetNm})})
            .then(() => {return historyCollection.insert({twitterId: recipientId, amount: amount, type: 1, targetNm: screenName})})
            .then(() => {if(isJPY) return lisk2jpy(amount)})
            .then((jpy) => {
                var params = [targetNm, `@${screenName}`, `${amount}LSK`];
                if (isJPY) params = [targetNm, `@${screenName}`, `${amount}LSK（約${jpy}円）`];
                var text = util.getMessage(config.message.tipOk, params);
                return tweet(text, replyId, targetNm);
            })
            .then(() => {resolve()})
            .catch((err) => {
                console.log("[" + util.getDateTimeString() + "]" + err);
                reject(err);
            });
        }
    });
}

var checkBalance = function(amount, balance, replyId, screenName){
    return new Promise(function(resolve, reject){
        if (util.isNumber(util.num2str(amount)) === false || +amount < 0.00000001 || +balance === 0 || +balance < +amount) {
            var text = util.getMessage(config.message.tipError, []);
            tweet(text, replyId, screenName)
            .then(() => {reject("tip: not have enough Lisk")})
            .catch((err) => {
                console.log(amount, balance, replyId, screenName)
                console.log("[" + util.getDateTimeString() + "]" + err);
                reject(err);
            });
        } else {
            resolve();
        }
    });
}