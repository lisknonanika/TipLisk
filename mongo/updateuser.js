const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = function(amount, twitterId, type, targetNm, execDate){
    MongoClient.connect(config.mongo.url, (error, client) => {
        const db = client.db(config.mongo.db);
        console.log('[MongoDB] open!!');

        db.collection(config.mongo.collectionUser, (error, collection) => {
            collection.find().toArray((error, docs) => {
                if(docs.length > 0) {
                    // update user
                    const condition = {"twitterId": twitterId};
                    const userdata = {"twitterId": twitterId, $inc:{"amount": amount}};
                    collection.updateOne(condition, userdata, (error, result) => {
                        if (error != null) {
                            console.log(error);
                            console.log('[MongoDB] close!!');
                            client.close();
                        } else {
                            console.log('[MongoDB] user update!!');
                            
                            // insert history
                            db.collection(config.mongo.collectionHistory, (error, collection) => {
                                const historydata = {"twitterId": twitterId, "type": type, "amount": amount, "execDate": execDate};
                                collection.insertOne(userdata, (error, result) => {
                                    if (error != null) {console.log(error);}
                                    else {console.log('[MongoDB] history insert!!');}
                                    console.log('[MongoDB] close!!');
                                    client.close();
                                });
                            });
                        }
                    });
                } else {
                    // insert user
                    const userdata = {"twitterId": twitterId, "amount": amount};
                    collection.insertOne(userdata, (error, result) => {
                        if (error != null) {
                            console.log(error);
                            console.log('[MongoDB] close!!');
                            client.close();
                        } else {
                            console.log('[MongoDB] user insert!!');
                            
                            // insert history
                            db.collection(config.mongo.collectionHistory, (error, collection) => {
                                const historydata = {"twitterId": twitterId, "type": type, "amount": amount, "execDate": execDate};
                                collection.insertOne(userdata, (error, result) => {
                                    if (error != null) {console.log(error);}
                                    else {console.log('[MongoDB] history insert!!');}
                                    console.log('[MongoDB] close!!');
                                    client.close();
                                });
                            });
                        }
                    });
                }
            });
        });
    });
}