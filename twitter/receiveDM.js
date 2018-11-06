const limitCtrlCollection = require('../mongo/limitCtrl');
const userCollection = require('../mongo/user');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId, amount, trxId){
    return new Promise(function(resolve, reject){
        userCollection.find({twitterId: twitterId})
        .then(() => {return limitCtrlCollection.update(config.twitter.dm.name)})
        .then((remain) => {return sendDM(twitterId, amount, trxId, remain)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var sendDM = function(twitterId, amount, trxId, remain){
    return new Promise(function(resolve, reject){
        if(remain > 0) {
            var text = util.getMessage(config.message.receiveDM, [util.num2str(amount), trxId]);
            var params = {event: {type: "message_create", message_create: {target: {recipient_id: twitterId}, message_data: {text: text}}}};
            config.TwitterClient.post('direct_messages/events/new', params, params)
            .then((result) => {
                console.log(`DM: ${twitterId}`);
                resolve();
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
        } else {
            console.log("Limit: DM");
            reject("Limit: DM");
        }
    });
}