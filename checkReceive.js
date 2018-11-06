const ObjectId = require('mongodb').ObjectId;
const async = require('async');
const config = require('./config');
const util = require('./util');
const receiveDM = require('./twitter/receiveDM');
const trxIdCollection = require('./mongo/trxId');
const userCollection = require('./mongo/user');
const historyCollection = require('./mongo/history');

module.exports = function(){
    trxIdCollection.find()
    .then((result) => {return getTransaction(config.lisk.getTransactionLimit, 0, !result? "": result.transactionId)})
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
        else if (trxData.length > 0 ) updUser();
    });
}

function updUser() {
    trxData.reverse();
    var successIdx = -1;
    async.eachSeries(trxData, function(item, callback){
        successIdx += 1;
        if (item.asset.data != null &&
            item.asset.data.length > 0 &&
            item.asset.data.toUpperCase() !== 'TIPLISK') {
                console.log(`transactionId: ${item.id}, userId: ${item.asset.data}`);
                userCollection.find({_id: ObjectId(item.asset.data)})
                .then((result) => {
                    if(!result) callback();
                    else {
                        userCollection.update({twitterId: result.twitterId, amout: util.calc(item.amount, 100000000, "div")})
                        .then(() => {return historyCollection.insert({twitterId: result.twitterId, amount: item.amount, type: 1, targetNm: 'TipLisk'})})
                        .then(() => {return receiveDM(result.twitterId, item.amount, item.id)})
                        .then(() => {callback()})
                        .catch((err) => {callback()});
                    }
                })
                .catch((err) => {callback()});
        } else {
            callback();
        }
    }, function (error) {
        trxIdCollection.update(trxData[successIdx].id);
    });
}