const lisk = require('lisk-elements').default;
const shuffle = require('shuffle-array');
const getBalance = require('../mongo/getBalance');
const tweet = require('../twitter/tweet');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId, amount, recipientId, replyId, screenName){
    return new Promise(function(resolve, reject){
        getBalance(twitterId)
        .then((balance) => {return checkBalance(amount, replyId, balance, screenName)})
        .then(() => {return withdraw(amount, recipientId)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var checkBalance = function(amount, replyId, balance, screenName){
    return new Promise(function(resolve, reject){
        if (util.isNumber(util.number2String(amount)) === false || amount < 0.00000001 || config.lisk.passphrase.length === 0 ||
            balance === 0 || util.minus(balance, 0.1) < amount) {
            var text = shuffle(config.message.withdrawError, {'copy': true})[0];
            text = util.formatString(text, [balance < 0.1? 0: util.number2String(util.minus(balance, 0.1))]);

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