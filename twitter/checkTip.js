const shuffle = require('shuffle-array');
const userCollection = require('../mongo/user');
const tweet = require('./tweet');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId, amount, replyId, screenName){
    return new Promise(function(resolve, reject){
        userCollection.find({twitterId: twitterId})
        .then((result) => {return checkBalance(amount, replyId, !result? "0": result.amount, screenName)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var checkBalance = function(amount, replyId, balance, screenName){
    return new Promise(function(resolve, reject){
        if (util.isNumber(util.num2str(amount)) === false || amount < 0.00000001 ||
            balance === 0 || +balance < amount) {
            var text = shuffle(config.message.tipError, {'copy': true})[0];
            text = util.formatString(text, balance);
            tweet(text, replyId, screenName)
            .then(() => {reject("tip: not have enough Lisk")})
            .catch((err) => {reject(err)});
        } else {
            resolve();
        }
    });
}