const userCollection = require('../mongo/user');
const config = require('../config');
const util = require('../util');
const dm = require('../twitter/dm');
const lisk2jpy = require('../api/lisk2jpy');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        var amount = "0";
        var commands = tweetInfo.text.match(config.regexp.balance)[0].trim().split(/\s/);
        var isJPY = (commands[1] === "残高" || commands[1] === "所持金");
        userCollection.find({twitterId: twitterId})
        .then((result) => {
            amount = !result? "0": result.amount;
            if (isJPY) return lisk2jpy(amount)
        })
        .then((jpy) => {
            var params = [`${amount}LSK`];
            if (isJPY) params = [`${amount}LSK（約${jpy}円）`];
            var text = "";
            if(commands[1].endsWith(":e")) {
                text = util.getMessageEng(config.message.balanceDM_e, params);
            } else {
                text = util.getMessage(config.message.balanceDM, params);
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
