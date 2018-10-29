const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(mentionId){
    MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
        const db = client.db(config.mongo.db);
        db.collection(config.mongo.collectionMentionId, (error, collection) => {
            // update latestMentionId
            collection.updateOne({}, {$set: {mentionId: mentionId}}, {upsert: true}, (error, result) => {
                client.close();
                if (!error) console.log("upsert latestMentionId");
                else console.log(error);
            });
        });
    });
}
