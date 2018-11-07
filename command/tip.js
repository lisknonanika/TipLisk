const userCollection = require('../mongo/user');
const historyCollection = require('../mongo/history');
const tweet = require('../twitter/tweet');
const config = require('../config');
const util = require('../util');

module.exports = function(tweetInfo, isReply) {
    return new Promise(function(resolve, reject){

        var twitterId = tweetInfo.user.id_str;
        var replyId = tweetInfo.id_str;
        var screenName = tweetInfo.user.screen_name;
        var recipientId = "";
        var targetNm = "";
        var amount = 0;
        if (isReply) {
            var commands = tweetInfo.text.match(config.regexp.tip_s)[0].split(/\s/);
            recipientId = tweetInfo.in_reply_to_user_id_str;
            targetNm = tweetInfo.in_reply_to_screen_name;
            amount = commands[2];

        } else {
            var commands = tweetInfo.text.match(config.regexp.tip)[0].split(/\s/);
            for (i = 0; i < tweetInfo.entities; i++) {
                if (tweetInfo.screen_name.toUpperCase() === commands[2].subString(1).toUpperCase()) {
                    recipientId = tweetInfo.entities[i].id_str;
                    break;
                }
            }
            targetNm = commands[2];
            amount = commands[3];
        }
        if (!recipientId) {
            resolve();
            return;
        }
        userCollection.find({twitterId: twitterId})
        .then((result) => {return checkBalance(amount, !result? "0": result.amount, replyId, screenName)})
        .then(() => {
            var text = util.getMessage(config.message.tipOk, [screenName, util.num2str(amount)]);
            return tweet(text, "", targetNm);
        })
        .then(() => {return userCollection.update({twitterId: twitterId, amount: util.calc(amount, -1, "mul")})})
        .then(() => {return userCollection.update({twitterId: recipientId, amount: amount})})
        .then(() => {return historyCollection.insert({twitterId: twitterId, amount: amount, type: 0, targetNm: targetNm})})
        .then(() => {return historyCollection.insert({twitterId: recipientId, amount: amount, type: 1, targetNm: screenName})})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var checkBalance = function(amount, balance, replyId, screenName){
    return new Promise(function(resolve, reject){
        if (util.isNumber(util.num2str(amount)) === false || amount < 0.00000001 || balance === 0 || +balance < amount) {
            console.log("tip: not have enough Lisk");
            var text = util.getMessage(config.message.tipError, [balance]);
            tweet(text, replyId, screenName)
            .then(() => {reject("tip: not have enough Lisk")})
            .catch((err) => {reject(err)});
        } else {
            resolve();
        }
    });
}