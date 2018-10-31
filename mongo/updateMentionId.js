const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(mentionId){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionMentionId, (error, collection) => {
                // update latestMentionId
                collection.updateOne({}, {$set: {mentionId: mentionId}}, {upsert: true}, (error, result) => {
                    client.close();
                    if (!error) {
                        console.log("upsert latestMentionId");
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
