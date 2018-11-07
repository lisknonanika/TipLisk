const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports.find = function(condition){
    return new Promise(function(resolve, reject){
        findByCondition(condition)
        .then((result) => {resolve(result)})
        .catch((err) => {reject(err)});
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
                    if (friends.length === 0) console.log(`friends.find: not found`);
                    else console.log(`friends.find: ${friends.length}人`);
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
                        console.log("upsert friends");
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

module.exports.delete = function(condition){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionFriends, (error, collection) => {
                collection.deleteOne(condition, (error, result) => {
                    client.close();
                    if (!error) {
                        console.log("delete friends");
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