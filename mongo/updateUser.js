const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const util = require('../util');

module.exports = function(amount, twitterId){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionUser, (error, collection) => {
                collection.findOne({twitterId: twitterId}, (error, result) => {
                    if(!result) {
                        // insert user
                        collection.insertOne({twitterId: twitterId, amount: util.number2String(amount)}, (error, result) => {
                            client.close();
                            if (!error) {
                                console.log("insert user: " + twitterId);
                                resolve();
                            } else {
                                console.log(error);
                                reject(error);
                            }
                        });

                    } else {
                        // update user
                        collection.updateOne({twitterId: twitterId}, {$set:{amount: util.number2String(util.plus(result.amount, amount))}}, (error, result) => {
                            client.close();
                            if (!error) {
                                console.log("update user: " + twitterId);
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