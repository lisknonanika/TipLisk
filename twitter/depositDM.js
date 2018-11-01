const updateLimitCtrl = require('../mongo/updateLimitCtrl');
const getDepositKey = require('../mongo/getDepositKey');
const config = require('../config');
const util = require('../util');

var depositKey = "";
module.exports = function(twitterId){
    return new Promise(function(resolve, reject){
        getDepositKey(twitterId)
        .then((key) => {return setDepositKey(key)})
        .then(() => {return updateLimitCtrl(config.twitter.dm.name)})
        .then((remain) => {return sendDM(twitterId, depositKey, remain)})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}

var setDepositKey = function(key) {
    return new Promise(function(resolve, reject){
        if (!result) {
            depositKey = "";
            reject("depositKey empty");
        } else {
            depositKey = key;
            resolve();
        }
    });
}

var sendDM = function(twitterId, depositKey, remain){
    return new Promise(function(resolve, reject){
        if(remain > 0) {
            var text = util.getMessage(config.message.depositDM, [depositKey, config.lisk.address]);
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