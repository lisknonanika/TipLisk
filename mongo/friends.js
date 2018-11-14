const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const util = require('../util');

module.exports.find = function(condition){
    return new Promise(function(resolve, reject){
        findByCondition(condition)
        .then((result) => {resolve(result)})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "]" + err);
            reject(err);
        });
    });
}

var findByCondition = function(condition) {
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionFriends, (error, collection) => {
                collection.find(condition).toArray((error, items) => {
                    var friends = items;
                    client.close();
                    resolve(friends);
                });
            });
        });
    });
}

module.exports.update = function(condition, data){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionFriends, (error, collection) => {
                collection.updateOne(condition, data, {upsert: true}, (error, result) => {
                    client.close();
                    if (!error) {
                        resolve();
                    } else {
                        console.log("[" + util.getDateTimeString() + "]" + error);
                        reject(error);
                    }
                });
            });
        });
    });
}

module.exports.delete = function(condition){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionFriends, (error, collection) => {
                collection.deleteOne(condition, (error, result) => {
                    client.close();
                    if (!error) {
                        resolve();
                    } else {
                        console.log("[" + util.getDateTimeString() + "]" + error);
                        reject(error);
                    }
                });
            });
        });
    });
}