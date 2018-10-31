const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(amount, twitterId, type, targetNm){
    return new Promise(function(resolve, reject){
		MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
            const db = client.db(config.mongo.db);
            db.collection(config.mongo.collectionHistory, (error, collection) => {
                const historydata = {twitterId: twitterId,
                                    type: type,
                                    amount: Math.abs(amount),
                                    targetNm: targetNm,
                                    execDate: new Date()};
                collection.insertOne(historydata, (error, result) => {
                    client.close();
                    if (!error) {
                        console.log("insert history");
                        resolve();
                    } else {
                        console.log(error);
                        reject(new Error(error));
                    }
                });
            });
        });
	});
}