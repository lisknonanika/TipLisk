const shuffle = require('shuffle-array');
const updateLimitCtrl = require('../mongo/updateLimitCtrl');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId, depositKey){
    return new Promise(function(resolve, reject){
        updateLimitCtrl(config.twitter.dm.name)
        .then((remain) => {return sendDM(twitterId, depositKey, remain)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}
var sendDM = function(twitterId, depositKey, remain){
    return new Promise(function(resolve, reject){
        if(remain > 0) {
            var text = shuffle(config.message.depositDM, {'copy': true})[0];
            text = util.formatString(text, [depositKey, config.lisk.address]);
            var params = {event: {type: "message_create", message_create: {target: {recipient_id: twitterId}, message_data: {text: text}}}};
            config.TwitterClient.post('direct_messages/events/new', params, params)
            .then((result) => {
                console.log("DM: " + twitterId);
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