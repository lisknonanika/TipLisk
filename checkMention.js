const config = require('./config');
const allocate = require('./allocate');
const mentionIdCollection = require('./mongo/mentionId');

module.exports = function(){
    mentionIdCollection.find({flg:1})
    .then((result) => {getMention(!result? 0: result.mentionId, 0, 0)})
    .catch((err) => console.log(err));
}

var mentionData = new Array();
function getMention(sinceId, maxId, idx) {
    config.TwitterClient.get('application/rate_limit_status', {resources: "statuses"})
    .then((result) => {
        console.log(result.resources.statuses['/statuses/mentions_timeline']);
        if (result.resources.statuses['/statuses/mentions_timeline'].remaining === 0) return;
        var params = {count: config.twitter.mention.count}
        if (maxId > 0) params['max_id'] = maxId;
        if (sinceId > 0) params['since_id'] = sinceId;
        config.TwitterClient.get('statuses/mentions_timeline', params)
        .then((result) => {
            for (i = 0; i < result.length; i++) {
                if (mentionData.length === 0 || mentionData[mentionData.length - 1].id_str !== result[i].id_str) {
                    mentionData.push(result[i]);
                    console.log(result[i]);
                    console.log(result[i].entities.user_mentions);
                }
            }
            if (result.length > 0 && idx < 5) getMention(result[result.length - 1].id, idx + 1);
            else if (mentionData.length > 0) execCommand(mentionData.pop());
        })
        .catch((err) => {console.log(err)});
    })
    .catch((err) => {console.log(err)});
}

function execCommand(item) {
    mentionIdCollection.update({flg:1}, {$set: {mentionId: item.id_str, flg: 1}})
    .then(() => {
        if (item.user.protected) {
            allocate(item)
            .then(() => {if (mentionData.length > 0) return execCommand(mentionData.pop())})
            .catch((err) => {console.log(err);if (mentionData.length > 0) return execCommand(mentionData.pop())});
        } else {
            if (mentionData.length > 0) execCommand(mentionData.pop());
        }
    })
}