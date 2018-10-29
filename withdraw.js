const lisk = require('lisk-elements').default;
const Decimal = require('decimal');
const dateformat = require('dateformat');
const config = require('./config');
const util = require('./util');
const updateUser = require('./mongo/updateUser');

module.exports = function(amount, recipientId, twitteriId, callback){
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
            const execDate = dateformat(new Date(), 'yyyy/mm/dd HH:MM:ss');
            updateUser(Decimal(amount).mul(-1).toNumber(), twitteriId, 0, recipientId, execDate, callback);
        });
}