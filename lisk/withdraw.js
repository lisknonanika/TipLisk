const lisk = require('lisk-elements').default;
const lconf = require('./config');

module.exports = function(amount, recipientId){
    var params = {
        amount: amount,
        recipientId: recipientId,
        passphrase: lconf.passphrase
    }
    if (lconf.secondPassphrase.length > 0) params['secondPassphrase'] = lconf.secondPassphrase;

    var trxstr = lisk.transaction.transfer(params);
    lconf.client.transactions.broadcast(trxstr)
        .then(res => {
            console.log(res.data);
        });
}