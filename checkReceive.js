const lisk = require('lisk-elements').default;
const MongoClient = require('mongodb').MongoClient;
const dateformat = require('dateformat');
const config = require('./config');
const updateTransactionId = require('./mongo/updateTransactionId');
const updateUser = require('./mongo/updateUser');

const TRX_LIMIT = 100;

module.exports = function(){
    getProcessedTransactionId();
}

function getProcessedTransactionId() {
    MongoClient.connect(config.mongo.url, (error, client) => {
        const db = client.db(config.mongo.db);
        console.log('[MongoDB] open!!');

        db.collection(config.mongo.collectionLiskTrx, (error, collection) => {
            collection.find().toArray((error, docs) => {
                if (error != null) {
                    console.log(error);
                    console.log('[MongoDB] close!!');
                    client.close();
                } else {
                    var trxId = docs.length > 0? docs[0].transactionId: "";
                    console.log('[MongoDB] close!!');
                    client.close();

                    // Get Transaction
                    getTransaction(TRX_LIMIT, 0, trxId);
                }
            });
        });
    });
}

var trxData = new Array();
function getTransaction(limit, idx, trxId) {
    var param = {recipientId: config.lisk.address,
        type: 0,
        limit: limit,
        offset: limit * idx,
        sort: 'timestamp:desc'}
    config.LiskClient.transactions.get(param)
        .then(res => {
            console.log(res.data);
            var infos = res.data;
            if (infos.length === 0) return;
            for (i=0; i < infos.length; i++) {
                var info = infos[i];
                if (info.id === trxId) break;
                trxData.push(info);
            }
            if (trxData.length === limit * (idx + 1)) {getTransaction(limit, idx + 1, trxId);
            } else {
                // Update ProcessedTransactionId
                updateTransactionId(trxData[0].id);

                // Update User
                updUser();
            }
        });
}

function updUser() {
    // update user
    trxData.forEach(element => {
        if (element.asset.data != null &&
            element.asset.data.length > 0 &&
            element.asset.data.toUpperCase() !== 'TIPLISK') {
                console.log('user update');
        }
    });
}