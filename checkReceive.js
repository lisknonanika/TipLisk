const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const async = require('async');
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
        db.collection(config.mongo.collectionLiskTrx, (error, collection) => {
            collection.find().toArray((error, docs) => {
                if (error != null) {
                    console.log(error);
                    client.close();
                } else {
                    var trxId = docs.length > 0? docs[0].transactionId: "";
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
    var items = trxData.reverse();
    var successIdx = -1;
    // update user
    async.eachSeries(items, function(item, callback){
        successIdx += 1;
        if (item.asset.data != null &&
            item.asset.data.length > 0 &&
            item.asset.data.toUpperCase() !== 'TIPLISK') {
                console.log("transaction id: " + item.id);

                MongoClient.connect(config.mongo.url, (error, client) => {
                    const db = client.db(config.mongo.db);
                    db.collection(config.mongo.collectionUser, (error, collection) => {
                        console.log(item.asset.data);
                        collection.find({_id: ObjectId(item.asset.data)}).toArray((error, docs) => {
                            if(docs.length>0) {
                                client.close();

                                // Update User
                                const execDate = dateformat(new Date(), 'yyyy/mm/dd HH:MM:ss');
                                updateUser(item.amount / 100000000, item.asset.data, 1, "TipLisk", execDate, callback);
                            } else {
                                client.close();
                            }
                        });
                    });
                });
        } else {
            callback();
        }
    }, function (error) {
        // Update ProcessedTransactionId
        if (error != null) successIdx -= 1;
        if (successIdx >= 0) updateTransactionId(trxData[successIdx].id);
    });
}