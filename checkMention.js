const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const config = require('./config');
const updateMentionId = require('./mongo/updateMentionId');
const followme = require('./twitter/followme');

const MENTION_LIMIT = 101;

module.exports = function(){
    MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
        const db = client.db(config.mongo.db);
        db.collection(config.mongo.collectionMentionId, (error, collection) => {
            collection.find().toArray((error, docs) => {
                client.close();
                var sinceId = docs.length === 0? 0: docs[0].mentionId;
                getMention(sinceId, 0, 0);
            });
        });
    });
}

var mentionData = new Array();
function getMention(sinceId, maxId, idx) {
    var params = {count: MENTION_LIMIT}
    if (maxId > 0) params['max_id'] = maxId;
    if (sinceId > 0) params['since_id'] = sinceId;

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
                            console.log(tweets[i].entities.user_mentions);
                        }
                    }
                    if (mentionData.length === (idx + 1) * MENTION_LIMIT && mentionData.length < 800) {
                        getMention(tweets[tweets.length - 1].id, idx + 1);
                    } else if (mentionData.length > 0) {
                        allocate();
                    }
                } else {
                    console.log(error);
                }
            });
        }
    });
}

function allocate() {
    mentionData.reverse();
    async.eachSeries(mentionData, function(item, callback){


        // twitter.user.id_str = '1052365035895283712'は除外（自分のツイートのため）
        // 宛先がない場合は返信先へ送付 例：@tiplsk tip 1 ->　tweets.in_reply_to_user_id_str

        // config.TwitterClient.get('users/show', {user_id:"900864154793197568"}, (error, result, response) => {
        //     if (!error) {
        //         console.log(result);
        //     }
        // });

        callback();

    }, function (error) {
        updateMentionId(mentionData[mentionData.length-1].id);
    });
}