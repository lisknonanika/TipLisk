const userCollection = require('../mongo/user');
const tweet = require('./tweet');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId, amount, replyId, screenName, targetNm) {
    return new Promise(function(resolve, reject){
        userCollection.find({twitterId: twitterId})
        .then((result) => {return checkBalance(amount, !result? "0": result.amount, replyId, screenName)})
        .then(() => {
            var text = util.getMessage(config.message.tipOk, [screenName, util.num2str(amount)]);
            return tweet(text, "", targetNm);
        })
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