const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(trxId){
    MongoClient.connect(config.mongo.url, (error, client) => {
        const db = client.db(config.mongo.db);
        db.collection(config.mongo.collectionLiskTrx, (error, collection) => {
            // update latestTransactionId
            collection.updateOne({}, {$set: {transactionId: trxId}}, {upsert: true}, (error, result) => {
                if (error != null) console.log(error);
                else console.log("upsert latestTransactionId");
                client.close();
            });
        });
    });
}
