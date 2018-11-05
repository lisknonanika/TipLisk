const config = require('./config');
const util = require('./util');
const userCollection = require('./mongo/user');
const historyCollection = require('./mongo/history');
const mentionIdCollection = require('./mongo/mentionId');
const depositDM = require('./twitter/depositDM');
const checkTip = require('./twitter/checkTip');
const balanceTweet = require('./twitter/balanceTweet');
const followme = require('./twitter/followme');
const withdraw = require('./lisk/withdraw');

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
                if (config.regexp.tip.test(tweetInfo.text)) return execTip(tweetInfo, false);
                else if (config.regexp.tip_s.test(tweetInfo.text)) return execTip(tweetInfo, true);
                else if (config.regexp.balance.test(tweetInfo.text)) return execBalance(tweetInfo);
                else if (config.regexp.deposit.test(tweetInfo.text)) return execDeposit(tweetInfo);
                else if (config.regexp.withdraw.test(tweetInfo.text)) return execWithdraw(tweetInfo);
                else if (config.regexp.followme.test(tweetInfo.text)) return execFollowme(tweetInfo);
            })
            .then(() => {resolve()})
            .catch((err) => {reject(err)});
        })
        .catch((err) => {reject(err)});
    });
}

var execTip = function(tweetInfo, isReply) {
    console.log("tip!");
    return new Promise(function(resolve, reject){
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
        checkTip(tweetInfo.user.id_str, +amount, tweetInfo.id_str, tweetInfo.user.screen_name)
        .then(() => {return userCollection.update({twitterId: tweetInfo.user.id_str, amount: util.calc(amount, -1, "mul")})})
        .then(() => {return userCollection.update({twitterId: recipientId, amount: amount})})
        .then(() => {return historyCollection.insert({twitterId: tweetInfo.user.id_str, amount: amount, type: 0, targetNm: targetNm})})
        .then(() => {return historyCollection.insert({twitterId: recipientId, amount: amount, type: 1, targetNm: tweetInfo.user.screen_name})})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var execBalance = function(tweetInfo) {
    console.log("balance!");
    return new Promise(function(resolve, reject){
        balanceTweet(tweetInfo.user.id_str, tweetInfo.id_str, tweetInfo.user.screen_name)
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var execDeposit = function(tweetInfo) {
    console.log("deposit!");
    return new Promise(function(resolve, reject){
        depositDM(tweetInfo.user.id_str)
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var execWithdraw = function(tweetInfo) {
    console.log("withdraw!");
    return new Promise(function(resolve, reject){
        var commands = tweetInfo.text.match(config.regexp.withdraw)[0].split(/\s/);
        withdraw(tweetInfo.user.id_str, +commands[3], commands[2], tweetInfo.id_str, tweetInfo.user.screen_name)
        .then(() => {return userCollection.update({twitterId: tem.user.id_str, amount: util.calc(commands[3], -1, "mul")})})
        .then(() => {return historyCollection.insert({twitterId: tweetInfo.user.id_str, amount: commands[3], type: 0, targetNm: commands[2]})})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var execFollowme = function(tweetInfo) {
    console.log("followme!");
    return new Promise(function(resolve, reject){
        followme(tweetInfo.user.id_str)
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}