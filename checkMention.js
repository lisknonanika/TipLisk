const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const config = require('./config');
const allocate = require('./allocate');
const mentionIdCollection = require('./mongo/mentionId');

module.exports = function(){
    MongoClient.connect(config.mongo.url, config.mongoClientParams, (error, client) => {
        const db = client.db(config.mongo.db);
        db.collection(config.mongo.collectionMentionId, (error, collection) => {
            collection.findOne((error, result) => {
                client.close();
                getMention(!result? 0: result.mentionId, 0, 0);
            });
        });
    });
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
            if (mentionData.length > 0 && idx < 5) {
                getMention(result[result.length - 1].id, idx + 1);
            } else if (mentionData.length > 0) {
                execCommand();
            }
        })
        .catch((err) => {console.log(err)});
    })
    .catch((err) => {console.log(err)});
}

function execCommand() {
    mentionData.reverse();
    async.eachSeries(mentionData, function(item, callback){
        allocate(item)
        .then(() => callback())
        .catch((err) => callback());    // continue
    }, function (error) {
        mentionIdCollection.update(mentionData[mentionData.length-1].id_str);
    });
}