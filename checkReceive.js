const ObjectId = require('mongodb').ObjectId;
const config = require('./config');
const util = require('./util');
const trxIdCollection = require('./mongo/trxId');
const userCollection = require('./mongo/user');
const historyCollection = require('./mongo/history');
const dm = require('./twitter/dm');

module.exports = function(){
    trxIdCollection.find()
    .then((result) => {return getTransaction(config.lisk.transactionLimit, 0, !result? "": result.transactionId)})
    .catch((err) => console.log(err));
}

var trxData = new Array();
function getTransaction(limit, idx, trxId) {
    var param = {recipientId: config.lisk.address,
        type: 0,
        limit: limit,
        offset: limit * idx,
        sort: 'timestamp:desc'}
    config.LiskClient.transactions.get(param)
    .then((res) => {
        var infos = res.data;
        if (infos.length === 0) return;
        for (i=0; i < infos.length; i++) {
            var info = infos[i];
            if (info.id === trxId) break;
            trxData.push(info);
        }
        if (trxData.length === limit * (idx + 1)) getTransaction(limit, idx + 1, trxId);
        else if (trxData.length > 0 ) receive(trxData.pop());
    });
}

function receive(item) {
    var key = item.asset.data;
    if (key != null && key.length > 0 && config.regexp.receivekey.test(key)) {
        console.log(`transactionId: ${item.id}, userId: ${key}`);
        trxIdCollection.update(item.id)
        .then(() => {return userCollection.find({_id: ObjectId(key)})})
        .then((result) => {
            if(result) {
                var amount = util.calc(item.amount, 100000000, "div");
                userCollection.update({twitterId: result.twitterId, amout: amount})
                .then(() => {return historyCollection.insert({twitterId: result.twitterId, amount: amount, type: 1, targetNm: item.senderId})})
                .then(() => {
                    var text = util.getMessage(config.message.receiveDM, [amount, item.id]);
                    return dm(result.twitterId, text)
                })
                .catch((err) => {console.log(err);if (trxData.length > 0) return receive(trxData.pop());})
            }
        })
        .then(() => {if (trxData.length > 0) return receive(trxData.pop())})
        .catch((err) => {console.log(err);if (trxData.length > 0) return receive(trxData.pop());})
    } else {if (trxData.length > 0) return receive(trxData.pop());}
}