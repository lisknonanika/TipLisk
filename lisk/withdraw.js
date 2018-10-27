const lisk = require('lisk-elements').default;
const config = require('../config');
const util = require('../util');

module.exports = function(amount, recipientId, twitterid){
    if (util.isNumber(amount) === false || amount < 0.00000001 || config.lisk.passphrase.length === 0) return;
    var params = {};
    params['amount'] = +amount * 100000000;
    params['recipientId'] = recipientId;
    params['passphrase'] = config.lisk.passphrase;
    if (config.lisk.secondPassphrase.length > 0) params['secondPassphrase'] = config.lisk.secondPassphrase;

    var trxstr = lisk.transaction.transfer(params);
    console.log(trxstr);
    config.liskclient.transactions.broadcast(trxstr)
        .then(res => {
            console.log(res.data);
        });
}