const MongoClient = require('mongodb').MongoClient;
const Decimal = require('decimal');
const config = require('../config');

module.exports = function(amount, twitterId){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
    
            db.collection(config.mongo.collectionUser, (error, collection) => {
                collection.find({twitterId: twitterId}).toArray((error, docs) => {
                    if(docs.length > 0) {
                        // update user
                        collection.updateOne({twitterId: twitterId}, {$set:{amount: Decimal(docs[0].amount).add(amount).toNumber()}}, (error, result) => {
                            client.close();
                            if (!error) {
                                console.log("update user: " + twitterId);
                                resolve();
                            } else {
                                console.log(error);
                                reject(error);
                            }
                        });
                    } else {
                        // insert user
                        collection.insertOne({twitterId: twitterId, amount: amount}, (error, result) => {
                            client.close();
                            if (!error) {
                                console.log("insert user: " + twitterId);
                                resolve();
                            } else {
                                console.log(error);
                                reject(error);
                            }
                        });
                    }
                });
            });
        });
    });
}