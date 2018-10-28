const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(trxId){
    MongoClient.connect(config.mongo.url, (error, client) => {
        const db = client.db(config.mongo.db);
        console.log('[MongoDB] open!!');

        db.collection(config.mongo.collectionLiskTrx, (error, collection) => {
            // update processedTransactionId
            const userdata = {$set: {transactionId: trxId}};
            collection.updateOne({}, userdata, {upsert: true}, (error, result) => {
                if (error != null) {
                    console.log(error);
                    console.log('[MongoDB] close!!');
                } else {
                    console.log('[MongoDB] processedTransactionId update!!');
                }
                client.close();
            });
        });
    });
}
