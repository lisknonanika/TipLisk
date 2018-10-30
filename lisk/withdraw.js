const lisk = require('lisk-elements').default;
const config = require('../config');
const util = require('../util');

module.exports = function(amount, recipientId){
    return new Promise(function(resolve, reject){
        if (util.isNumber(amount) === false || amount < 0.00000001 || config.lisk.passphrase.length === 0) return;
        var params = {
            amount: +amount * 100000000,
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