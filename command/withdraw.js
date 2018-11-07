const lisk = require('lisk-elements').default;
const userCollection = require('../mongo/user');
const historyCollection = require('../mongo/history');
const tweet = require('../twitter/tweet');
const dm = require('../twitter/dm');
const config = require('../config');
const util = require('../util');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var commands = tweetInfo.text.match(config.regexp.withdraw)[0].split(/\s/);
        var twitterId = tweetInfo.user.id_str;
        var amount = commands[3];
        var recipientId = commands[2];
        var replyId = tweetInfo.id_str;
        var screenName = tweetInfo.user.screen_name;

        userCollection.find({twitterId: twitterId})
        .then((result) => {return checkBalance(+amount, replyId, !result? "0": result.amount, screenName)})
        .then(() => {return withdraw(amount, recipientId)})
        .then((trxId) => {
            var text = util.getMessage(config.message.withdrawOk, [amount, recipientId, trxId]);
            return dm(twitterId, text);
        })
        .then(() => {return userCollection.update({twitterId: twitterId, amount: util.calc(amount, -1, "mul")})})
        .then(() => {return historyCollection.insert({twitterId: twitterId, amount: amount, type: 0, targetNm: recipientId})})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var checkBalance = function(amount, replyId, balance, screenName){
    return new Promise(function(resolve, reject){
        if (util.isNumber(util.num2str(amount)) === false || amount < 0.00000001 ||
            balance === 0 || +util.calc(balance, 0.1, "sub") < amount) {
            var text = util.getMessage(config.message.withdrawError, [balance < 0.1? 0: util.calc(balance, 0.1, "sub")]);
            tweet(text, replyId, screenName)
            .then(() => {reject("withdraw: not have enough Lisk")})
            .catch((err) => {reject(err)});
        } else {
            resolve();
        }
    });
}

var withdraw = function(amount, recipientId){
    return new Promise(function(resolve, reject){
        var params = {
            amount: util.calc(amount, 100000000, "mul"),
            recipientId: recipientId,
            passphrase: config.lisk.passphrase,
            data: 'TipLisk'
        }
        if (config.lisk.secondPassphrase.length > 0) params['secondPassphrase'] = config.lisk.secondPassphrase;
    
        var trxstr = lisk.transaction.transfer(params);
        console.log(trxstr);
        config.LiskClient.transactions.broadcast(trxstr)
        .then(res => {
            console.log(res.data);
            resolve(trxstr.id);
        }, function(error){
            console.log(error);
            reject(error);
        });
    });
}