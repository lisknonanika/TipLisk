const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const insertHistory = require('./insertHistory');

module.exports = function(amount, twitterId, type, targetNm, execDate, callback){
    MongoClient.connect(config.mongo.url, (error, client) => {
        const db = client.db(config.mongo.db);

        db.collection(config.mongo.collectionUser, (error, collection) => {
            collection.find({twitterId: twitterId}).toArray((error, docs) => {
                if(docs.length > 0) {
                    // update user
                    collection.updateOne({twitterId: twitterId}, {$inc:{amount: amount}}, (error, result) => {
                        if (error != null) {
                            console.log(error);
                            client.close();
                            callback(error);
                        } else {
                            console.log("update user: " + twitterId);

                            // insert history
                            insertHistory(db, client, amount, twitterId, type, targetNm, execDate, callback);
                        }
                    });
                } else {
                    // insert user
                    collection.insertOne({twitterId: twitterId, amount: amount}, (error, result) => {
                        if (error != null) {
                            console.log(error);
                            client.close(error);
                            callback(error);
                        } else {
                            console.log("insert user: " + twitterId);

                            // insert history
                            insertHistory(db, client, amount, twitterId, type, targetNm, execDate, callback);
                        }
                    });
                }
            });
        });
    });
}