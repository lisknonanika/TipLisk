const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const util = require('../util');

module.exports.update = function(target){
    return new Promise(function(resolve, reject){
        MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionLimitCtrl, (error, collection) => {
                collection.deleteMany({name: target, execDate:{$lte: util.getDateTime(config.twitter[target].interval * -1)}}, (error, result) => {
                    if (error) {
                        client.close();
                        console.log("[" + util.getDateTimeString() + "] update");
                        console.log(target);
                        console.log(error);
                        reject(error);
                        return;
                    }

                    var remain = 0;
                    collection.find({name: target}).toArray((error, items) => {
                        remain = config.twitter[target].max - items.length;
                        if (remain <= 0) {
                            client.close();
                            resolve(remain);
                        } else {
                            collection.insertOne({name: target, execDate: util.getDateTime()}, (error, result) => {
                                client.close();
                                if (!error) {resolve(remain);} 
                                else {
                                    console.log("[" + util.getDateTimeString() + "] update");
                                    console.log(target);
                                    console.log(error);
                                    reject(error);
                                    return;
                                }
                            });
                        }
                    });

                });
            });
        });
    });
}
