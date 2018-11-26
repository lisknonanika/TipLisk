const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const util = require('../util');

module.exports.find = function(condition){
    return new Promise(function(resolve, reject){
        findMany(condition)
        .then((result) => {resolve(result)})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "] find");
            console.log(condition);
            console.log(err);
            reject(err);
        });
    });
}
var findMany = function(condition) {
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionHistory, (error, collection) => {
                collection.find(condition).sort({execDate: -1}).limit(20).toArray((error, items) => {
                    client.close();
                    resolve(items);
                });
            });
        });
    });
}

module.exports.insert = function(param){
    return new Promise(function(resolve, reject){
		MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionHistory, (error, collection) => {
                const historydata = {twitterId: param.twitterId,
                                    type: param.type,
                                    amount: util.num2str(param.amount),
                                    targetNm: param.targetNm,
                                    execDate: new Date()};
                collection.insertOne(historydata, (error, result) => {
                    client.close();
                    if (!error) {
                        resolve();
                    } else {
                        console.log("[" + util.getDateTimeString() + "] insert");
                        console.log(param);
                        console.log(error);
                        reject(error);
                    }
                });
            });
        });
	});
}