const lisk = require('lisk-elements').default;
const shuffle = require('shuffle-array');
const userCollection = require('../mongo/user');
const tweet = require('../twitter/tweet');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId, amount, recipientId, replyId, screenName){
    return new Promise(function(resolve, reject){
        userCollection.find({twitterId: twitterId})
        .then((result) => {return checkBalance(amount, replyId, !result? 0: result.amount, screenName)})
        .then(() => {return withdraw(amount, recipientId)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var checkBalance = function(amount, replyId, balance, screenName){
    return new Promise(function(resolve, reject){
        if (util.isNumber(util.num2str(amount)) === false || amount < 0.00000001 || config.lisk.passphrase.length === 0 ||
            balance === 0 || +util.calc(balance, 0.1, "sub") < amount) {
            var text = shuffle(config.message.withdrawError, {'copy': true})[0];
            text = util.formatString(text, [balance < 0.1? 0: util.calc(balance, 0.1, "sub")]);
            tweet(text, replyId, screenName)
            .then(() => {reject("amount less than 0.00000001")})
            .catch((err) => {reject(err)});
        } else {
            resolve();
        }
    });
}

var withdraw = function(amount, recipientId){
    return new Promise(function(resolve, reject){
        var params = {
            amount: util.multiply(amount, 100000000),
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
            resolve();
        }, function(error){
            console.log(error);
            reject(error);
        });
    });
}