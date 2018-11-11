const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const util = require('../util');

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
                        // console.log("insert history");
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