const userCollection = require('../mongo/user');
const config = require('../config');
const util = require('../util');
const dm = require('../twitter/dm');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        var commands = tweetInfo.text.match(config.regexp.deposit)[0].trim().split(/\s+/);
        userCollection.find({twitterId: twitterId})
        .then((result) => {
            if (!result) {
                reject("depositKey empty");
                return;
            }
            var params = [result._id.toHexString(), config.lisk.address];
            var text = "";
            if(commands[1].endsWith(":e")) {
                text = util.getMessageEng(config.message.depositDM_e, params);
            } else {
                text = util.getMessage(config.message.depositDM, params);
            }
            return dm(twitterId, text);
        })
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "] Main");
            console.log(err);
            reject(err);
        });
    });
}