const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports.update = function(trxId){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionLiskTrx, (error, collection) => {
                // update latestTransactionId
                collection.updateOne({}, {$set: {transactionId: trxId}}, {upsert: true}, (error, result) => {
                    client.close();
                    if (!error) {
                        console.log("upsert latestTransactionId");
                        resolve();
                    } else {
                        console.log(error);
                        reject(error);
                    }
                });
            });
        });
    });
}
