const lisk = require('lisk-elements').default;
const lconf = require('./config');
const util = require('../util');

module.exports = function(amount, recipientId){
    if (util.isNumber(amount) === false || amount < 0.00000001) return;
    var params = {};
    params['amount'] = +amount * 100000000;
    params['recipientId'] = recipientId;
    params['passphrase'] = lconf.passphrase;
    if (lconf.secondPassphrase.length > 0) params['secondPassphrase'] = lconf.secondPassphrase;

    var trxstr = lisk.transaction.transfer(params);
    console.log(trxstr);
    lconf.client.transactions.broadcast(trxstr)
        .then(res => {
            console.log(res.data);
        });
}