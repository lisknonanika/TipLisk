const config = require('../config');

module.exports = function(db, client, amount, twitterId, type, targetNm, execDate, callback){
    db.collection(config.mongo.collectionHistory, (error, collection) => {
        const historydata = {twitterId: twitterId,
                             type: type,
                             amount: Math.abs(amount),
                             targetNm: targetNm,
                             execDate: execDate};
        collection.insertOne(historydata, (error, result) => {
            client.close();
            if (!error) console.log("insert history");
            else console.log(error);
            callback(error);
        });
    });
}