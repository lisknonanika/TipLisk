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
            db.collection(config.mongo.collectionFriends, (error, collection) => {
                collection.findOne(condition, (error, result) => {
                    client.close();
                    if (!result) console.log(`friends.find: not found`);
                    else console.log(`friends.find: ${result.twitterId}`);
                    resolve(result);
                });
            });
        });
    });
}
module.exports.findAll = function(){
    return new Promise(function(resolve, reject){
        findAll()
        .then((result) => {resolve(result)})
        .catch((err) => reject(err));
    });
}

var findAll = function() {
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionFriends, (error, collection) => {
                collection.find({}, (error, result) => {
                    client.close();
                    if (!result) console.log(`friends.find: not found`);
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