const config = require('../config');

module.exports = function(db, client, amount, twitterId, type, targetNm, execDate, callback){
    db.collection(config.mongo.collectionHistory, (error, collection) => {
        const historydata = {twitterId: twitterId,
                             type: type,
                             amount: Math.abs(amount),
                             targetNm: targetNm,
                             execDate: execDate};
        collection.insertOne(historydata, (error, result) => {
            if (error != null) {
                console.log(error);
                client.close();
                callback(error);
            } else {
                console.log("insert history");
                client.close();
                callback();
            }
        });
    });
}