const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports.find = function(condition){
    return new Promise(function(resolve, reject){
        findOne(condition)
        .then((result) => {resolve(result)})
        .catch((err) => reject(err));
    });
}

var findOne = function(condition) {
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionMentionId, (error, collection) => {
                collection.findOne(condition, (error, result) => {
                    client.close();
                    if (!result) console.log(`mentionId.find: not found`);
                    else console.log(`mentionId.find: ${result.mentionId}`);
                    resolve(result);
                });
            });
        });
    });
}

module.exports.update = function(condition, data){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionMentionId, (error, collection) => {
                collection.updateOne(condition, data, {upsert: true}, (error, result) => {
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

module.exports.insertHistory = function(mentionId){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionMentionId, (error, collection) => {
                collection.insertOne({mentionId: mentionId, execDate: new Date(), flg: 0}, (error, result) => {
                    client.close();
                    if (!error) {
                        console.log("insert mentionId");
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