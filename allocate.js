const config = require('./config');
const util = require('./util');
const userCollection = require('./mongo/user');
const historyCollection = require('./mongo/history');
const depositDM = require('./twitter/depositDM');
const checkTip = require('./twitter/checkTip');
const balanceTweet = require('./twitter/balanceTweet');
const followme = require('./twitter/followme');
const withdraw = require('./lisk/withdraw');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        // check blacklist or retweet
        if (config.blacklist.indexOf(tweetInfo.user.id_str) >= 0 || tweetInfo.retweeted_status) {
            resolve();
            return;
        }

        // allocate
        if (config.regexp.tip.test(tweetInfo.text)) {
            console.log("tip!");

            var recipientId = "";
            for (i = 0; i < tweetInfo.entities; i++) {
                if (tweetInfo.screen_name.toUpperCase() === commands[2].subString(1).toUpperCase()) {
                    recipientId = tweetInfo.entities[i].id_str;
                    break;
                }
            }
            var commands = tweetInfo.text.match(config.regexp.tip)[0].split(/\s/);
            checkTip(tweetInfo.user.id_str, +commands[3], tweetInfo.id_str, tweetInfo.user.screen_name)
            .then(userCollection.update({twitterId: tem.user.id_str, amount: util.calc(commands[3], -1, "mul"), latestTweetId: tweetInfo.id_str}))
            .then(userCollection.update({twitterId: recipientId, amount: commands[3]}))
            .then(historyCollection.insert({twitterId: tweetInfo.user.id_str, amount: commands[3], type: 0, targetNm: commands[2]}))
            .then(historyCollection.insert({twitterId: recipientId, amount: commands[3], type: 1, targetNm: tweetInfo.user.screen_name}))
            .then(() => {resolve()})
            .catch((err) => {reject(err)});

        } else if (config.regexp.tip_s.test(tweetInfo.text)) {
            if (!tweetInfo.in_reply_to_user_id_str) {
                resolve();
                return;
            }
            console.log("tip!");
            var commands = tweetInfo.text.match(config.regexp.tip_s)[0].split(/\s/);
            checkTip(tweetInfo.user.id_str, +commands[2], tweetInfo.id_str, tweetInfo.user.screen_name)
            .then(userCollection.update({twitterId: tem.user.id_str, amount: util.calc(commands[2], -1, "mul"), latestTweetId: tweetInfo.id_str}))
            .then(userCollection.update({twitterId: tweetInfo.in_reply_to_user_id_str, amount: commands[2]}))
            .then(historyCollection.insert({twitterId: tweetInfo.user.id_str, amount: commands[2], type: 0, targetNm: tweetInfo.in_reply_to_screen_name}))
            .then(historyCollection.insert({twitterId: tweetInfo.in_reply_to_user_id_str, amount: commands[2], type: 1, targetNm: tweetInfo.user.screen_name}))
            .then(() => {resolve()})
            .catch((err) => {reject(err)});

        } else if (config.regexp.balance.test(tweetInfo.text)) {
            console.log("balance!");
            balanceTweet(tweetInfo.user.id_str, tweetInfo.id_str, tweetInfo.user.screen_name)
            .then(() => {return userCollection.update({twitterId: tem.user.id_str, latestTweetId: tweetInfo.id_str})})
            .then(() => {resolve()})
            .catch((err) => {reject(err)});

        } else if (config.regexp.deposit.test(tweetInfo.text)) {
            console.log("deposit!");
            depositDM(tweetInfo.user.id_str)
            .then(() => {return userCollection.update({twitterId: tem.user.id_str, latestTweetId: tweetInfo.id_str})})
            .then(() => {resolve()})
            .catch((err) => {reject(err)});

        } else if (config.regexp.withdraw.test(tweetInfo.text)) {
            console.log("withdraw!");
            var commands = tweetInfo.text.match(config.regexp.withdraw)[0].split(/\s/);
            withdraw(tweetInfo.user.id_str, +commands[3], commands[2], tweetInfo.id_str, tweetInfo.user.screen_name)
            .then(() => {return userCollection.update({twitterId: tem.user.id_str, amount: util.calc(commands[3], -1, "mul"), latestTweetId: tweetInfo.id_str})})
            .then(() => {return historyCollection.insert({twitterId: tweetInfo.user.id_str, amount: commands[3], type: 0, targetNm: commands[2]})})
            .then(() => {resolve()})
            .catch((err) => {reject(err)});

        } else if (config.regexp.followme.test(tweetInfo.text)) {
            console.log("followme!");
            followme(tweetInfo.user.id_str)
            .then(() => {return userCollection.update({twitterId: tem.user.id_str, latestTweetId: tweetInfo.id_str})})
            .then(() => {resolve()})
            .catch((err) => {reject(err)});

        } else {
            resolve();
        }
    });
}