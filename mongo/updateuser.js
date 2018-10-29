const MongoClient = require('mongodb').MongoClient;
const Decimal = require('decimal');
const config = require('../config');
const insertHistory = require('./insertHistory');

module.exports = function(amount, twitterId, type, targetNm, execDate, callback){
    MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
        const db = client.db(config.mongo.db);

        db.collection(config.mongo.collectionUser, (error, collection) => {
            collection.find({twitterId: twitterId}).toArray((error, docs) => {
                if(docs.length > 0) {
                    // update user
                    collection.updateOne({twitterId: twitterId}, {$set:{amount: Decimal(docs[0].amount).add(amount).toNumber()}}, (error, result) => {
                        if (!error) {
                            console.log("update user: " + twitterId);
                            insertHistory(db, client, amount, twitterId, type, targetNm, execDate, callback);
                        } else {
                            console.log(error);
                            client.close();
                            callback(error);
                        }
                    });
                } else {
                    // insert user
                    collection.insertOne({twitterId: twitterId, amount: amount}, (error, result) => {
                        if (!error) {
                            console.log("insert user: " + twitterId);
                            insertHistory(db, client, amount, twitterId, type, targetNm, execDate, callback);
                        } else {
                            console.log(error);
                            client.close(error);
                            callback(error);
                        }
                    });
                }
            });
        });
    });
}