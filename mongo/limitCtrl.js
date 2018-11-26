const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const util = require('../util');

module.exports.update = function(target){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionLimitCtrl, (error, collection) => {
                collection.findOne({name: target}, (error, result) => {
                    var data = {};
                    if (!result || result.reset <= util.getDateTime()) {
                        data = {$set: {name: target,
                                       max: config.twitter[target].max,
                                       remain: config.twitter[target].max,
                                       reset: util.getDateTime(config.twitter[target].interval)}};
                    } else {
                        data= {$set: {remain: result.remain - 1}};
                    }
                    collection.updateOne({name: target}, data, {upsert: true}, (error, result) => {
                        client.close();
                        if (!error) {
                            resolve(data["$set"].remain);
                        } else {
                            console.log("[" + util.getDateTimeString() + "] update");
                            console.log(target);
                            console.log(error);
                            reject(error);
                        }
                    });
                });
            });
        });
    });
}
