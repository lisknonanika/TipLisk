const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const config = require('../config');
const util = require('../util');

module.exports.find = function(condition){
    return new Promise(function(resolve, reject){
        findOne(condition)
        .then((result) => {resolve(result)})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "]" + err);
            reject(err);
        });
    });
}

var findOne = function(condition) {
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionUser, (error, collection) => {
                collection.findOne(condition, (error, result) => {
                    client.close();
                    // if (!result) console.log(`user.find: not found`);
                    // else console.log(`user.find: ${result.twitterId}`);
                    resolve(result);
                });
            });
        });
    });
}

module.exports.update = function(param){
    return new Promise(function(resolve, reject){
        var condition = {};
        if (param._id) condition['_id'] = ObjectId(param._id);
        if (param.twitterId) condition['twitterId'] = param.twitterId;
        findOne(condition)
        .then((result) => {
            if (!result) {
                param['amount'] = !param['amount']? "0": util.num2str(param['amount']);
                return updateOne(param);
            } else if (!param.noupd) {
                param['amount'] = !param['amount']? result.amount: util.calc(param['amount'], result.amount, "add");
                return updateOne(param);
            }
        })
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "]" + err);
            reject(err);
        });
    });
}

var updateOne = function(param) {
    return new Promise(function(resolve, reject){
        var condition = {};
        if (param._id) condition['_id'] = ObjectId(param._id);
        if (param.twitterId) condition['twitterId'] = param.twitterId;
        var data = {amount: param.amount};
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionUser, (error, collection) => {
                collection.updateOne(condition, {$set: data}, {upsert: true}, (error, result) => {
                    client.close();
                    if (!error) {
                        // console.log(`upsert user: ${param.twitterId}`);
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