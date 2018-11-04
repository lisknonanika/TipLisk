const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports.find = function(){
    return new Promise(function(resolve, reject){
        findOne()
        .then((result) => {resolve(result)})
        .catch((err) => reject(err));
    });
}

var findOne = function() {
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionLiskTrx, (error, collection) => {
                collection.findOne((error, result) => {
                    client.close();
                    if (!result) console.log(`transactionId.find: not found`);
                    else console.log(`transactionId.find: ${result.transactionId}`);
                    resolve(result);
                });
            });
        });
    });
}

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
