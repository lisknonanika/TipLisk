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
    var params = {count: config.twitter.getMentionCount}
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
                    if (mentionData.length === (idx + 1) * MENTION_LIMIT && mentionData.length < config.twitter.getMentionLimit) {
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
        // check blacklist
        if (config.blacklist.indexOf(item.user.id_str) >= 0) callback();

        // allocate
        if (config.regexp.tip.test(item.text)) {
            console.log("tip!");
        } else if (config.regexp.tip_s.test(item.text)) {
            console.log("tip!");

            //item.in_reply_to_user_id_strがnullなら無視

        } else if (config.regexp.balance.test(item.text)) {
            console.log("balance!");
            callback();

        } else if (config.regexp.deposit.test(item.text)) {
            console.log("deposit!");
            callback();

        } else if (config.regexp.withdraw.test(item.text)) {
            console.log("withdraw!");
            callback();

        } else if (config.regexp.followme.test(item.text)) {
            console.log("followme!");
            followme(item.user.id_str)
            .then(function(){callback()})
            .catch(function(err){callback(err);});
        } else {
            callback();
        }

    }, function (error) {
        updateMentionId(mentionData[mentionData.length-1].id);
    });
}