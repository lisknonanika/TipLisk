const userCollection = require('../mongo/user');
const config = require('../config');
const util = require('../util');
const dm = require('../twitter/dm');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        userCollection.find({twitterId: twitterId})
        .then((result) => {
            if (!result) {
                reject("depositKey empty");
                return;
            }
            var text = util.getMessage(config.message.depositDM, [result._id.toHexString(), config.lisk.address]);
            return dm(twitterId, text);
        })
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}