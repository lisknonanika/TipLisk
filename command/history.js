const dateformat = require('dateformat');
const historyCollection = require('../mongo/history');
const dm = require('../twitter/dm');
const util = require('../util');

module.exports = function(tweetInfo){
    return new Promise(function(resolve, reject){
        var twitterId = tweetInfo.user.id_str;
        historyCollection.find({twitterId: twitterId})
        .then((result) => {
            var text = "";
            if (!result || result.length === 0) {
                text = "履歴がありません。\n";
            } else {
                var text = "入出金履歴をお知らせします。\n\n";
                for(i=0; i<result.length;i++) {
                    var ymd = dateformat(result[i].execDate, 'yyyy/mm/dd HH:MM:ss');
                    var io = result[i].type === 0? "へ": "から";
                    var amount = result[i].amount + "LSK";
                    var target = result[i].targetNm; 
                    text = text + `[${ymd}]\n${target} ${io} ${amount}\n\n`;
                }
            }
            return dm(twitterId, text);
        })
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "]" + err);
            reject(err);
        });
    });
}