const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionUser, (error, collection) => {
                collection.findOne({twitterId: twitterId}, (error, result) => {
                    client.close();
                    console.log("getBalance: " + (!result? 0: result.amount));
                    resolve(!result? 0: result.amount);
                });
            });
        });
    });
}