const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

const MENTION_LIMIT = 101;

module.exports = function(){
    getMention(0, 0);
}

var mentionData = new Array();
function getMention(maxId, idx) {
    var params = {count: MENTION_LIMIT}
    if (maxId > 0) {
        params['max_id'] = maxId;
    }

    config.TwitterClient.get('application/rate_limit_status', params, (error, result, response) => {
        if (!error) {
            console.log(result.resources.statuses['/statuses/mentions_timeline']);
            if (result.resources.statuses['/statuses/mentions_timeline'].remaining === 0) return;

            config.TwitterClient.get('statuses/mentions_timeline', params, (error, tweets, response) => {
                if (!error) {
                    for (i = 0; i < tweets.length; i++) {
                        if (mentionData.length === 0 || mentionData[mentionData.length - 1].id !== tweets[i].id) {
                            mentionData.push(tweets[i]);
                            console.log(tweets[i]);
                        }
                    }
                    if (mentionData.length === (idx + 1) * MENTION_LIMIT && mentionData.length < 800) {
                        getMention(tweets[tweets.length - 1].id, idx + 1);
                    } else {
        
                    }
                } else {
                    console.log(error);
                }
            });
        }
    });
}