const limitCtrlCollection = require('../mongo/limitCtrl');
const config = require('../config');

module.exports = function(twitterId, text){
    return new Promise(function(resolve, reject){
        limitCtrlCollection.update(config.twitter.dm.name)
        .then((remain) => {return sendDM(twitterId, text, remain)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var sendDM = function(twitterId, text, remain){
    return new Promise(function(resolve, reject){
        if(remain > 0) {
            var params = {event: {type: "message_create", message_create: {target: {recipient_id: twitterId}, message_data: {text: text}}}};
            config.TwitterClient.post('direct_messages/events/new', params, params)
            .then((result) => {
                // console.log(`DM: ${twitterId}`);
                resolve();
            })
            .catch((err) => {reject(err);});
        } else {
            // console.log("Limit: DM");
            reject("Limit: DM");
        }
    });
}