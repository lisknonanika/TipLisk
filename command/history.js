const dateformat = require('dateformat');
const historyCollection = require('../mongo/history');
const dm = require('../twitter/dm');
const config = require('../config');
const util = require('../util');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        var commands = tweetInfo.text.match(config.regexp.history)[0].trim().split(/\s/);
        historyCollection.find({twitterId: twitterId})
        .then((result) => {
            var text = "";
            if (!result || result.length === 0) {
                text = commands[1].endsWith(":e")? "-Withdrawal details-\n\nnone.\n": "入出金履歴がありません。\n";
            } else {
                var text = commands[1].endsWith(":e")? "-Withdrawal details-\n\n": "入出金履歴をお知らせします。\n\n";
                for(i=0; i<result.length;i++) {
                    var ymd = dateformat(result[i].execDate, 'yyyy/mm/dd HH:MM:ss');
                    if (commands[1].endsWith(":e")) ymd = ymd + "(UTC+0900)";
                    var io = result[i].type === 0? "To": "From";
                    var amount = result[i].amount + "LSK";
                    var target = result[i].targetNm; 
                    text = text + `[${ymd}]\n${amount} ${io} ${target}\n\n`;
                }
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