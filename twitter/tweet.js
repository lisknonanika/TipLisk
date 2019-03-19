const limitCtrlCollection = require('../mongo/limitCtrl');
const config = require('../config');
const util = require('../util');

module.exports = function(text, replyId, replyuser){
    return new Promise(function(resolve, reject){
        limitCtrlCollection.update(config.twitter.tweet.name)
        .then((remain) => {return tweet(text, replyId, replyuser, remain)})
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "] Main");
            console.log(replyId, replyuser);
            console.log(err);
            reject(err);
        });
    });
}

var tweet = function(text, replyId, replyuser, remain){
    return new Promise(function(resolve, reject){
        if(remain > 0) {
            var param ={}
            param['status'] = !replyuser? text: `${replyuser} ${text}`;
            param['in_reply_to_status_id'] = !replyId? null: replyId;
            config.TwitterClient.post('statuses/update', param)
            .then((result) => {
                resolve();
            })
            .catch((err) => {
                console.log("[" + util.getDateTimeString() + "] tweet");
                console.log(replyId, replyuser);
                console.log(err);
                reject(err);
            });

        } else {
            reject("Limit: tweet");
        }
    });
}
