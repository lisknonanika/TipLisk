const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionUser, (error, collection) => {
                collection.find({twitterId: twitterId}).toArray((error, docs) => {
                    client.close();
                    if(docs.length > 0) {
                        console.log("getDepositKey: " + docs[0]._id.toHexString());
                        resolve(docs[0]._id.toHexString());
                    } else {
                        console.log("getDepositKey: none");
                        resolve("");
                    }
                });
            });
        });
    });
}