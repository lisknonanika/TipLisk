const follow = require('../twitter/follow');
const friendsCollection = require('../mongo/friends');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_st;
        friendsCollection.find({twitterId: twitterId})
        .then((result) => {
            if (!result || result.friend === 0) {
                return follow(twitterId);
            } else {
                console.log("already friends!");
                reject("already friends!");
            }
        })
        .then(() => {return friendsCollection.update({twitterId: twitterId}, {$set:{twitterId: twitterId, friend: 1}})})
        .then(() => {resolve()})
        .catch((err) => {reject(err)});
    });
}
