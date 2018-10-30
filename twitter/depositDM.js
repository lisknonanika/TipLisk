const shuffle = require('shuffle-array');
const config = require('../config');
const util = require('../util');

module.exports = function(twitterId, depositKey){
    return new Promise(function(resolve, reject){
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
    });
}