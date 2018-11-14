const util = require('../util');
const follow = require('../twitter/follow');
const friendsCollection = require('../mongo/friends');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        friendsCollection.find({twitterId: twitterId})
        .then((result) => {
            if (!result || result.length === 0 || result[0].friend === 0) return follow(twitterId);
            else reject("already friends!");
        })
        .then(() => {return friendsCollection.update({twitterId: twitterId}, {$set:{twitterId: twitterId, friend: 1}})})
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "]" + err);
            reject(err);
        });
    });
}
