const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const config = require('./config');
const updateUser = require('./mongo/updateUser');
const updateMentionId = require('./mongo/updateMentionId');
const getDepositKey = require('./mongo/getDepositKey');
const depositDM = require('./twitter/depositDM');
const followme = require('./twitter/followme');

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
                if (mentionData.length === 0 || mentionData[mentionData.length - 1].id !== result[i].id) {
                    mentionData.push(result[i]);
                    console.log(result[i]);
                    console.log(result[i].entities.user_mentions);
                }
            }
            var maxsize = config.twitter.mention.count;
            if (idx > 0) maxsize += ((config.twitter.mention.count - 1) * idx);
            if (mentionData.length === maxsize && mentionData.length < config.twitter.mention.max) {
                getMention(result[result.length - 1].id, idx + 1);
            } else if (mentionData.length > 0) {
                allocate();
            }
        })
        .catch((err) => {console.log(err)});
    })
    .catch((err) => {console.log(err)});;
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
            updateUser(0, item.user.id_str)
            .then(() => {return getDepositKey(item.user.id_str)})
            .then((depositKey) => {return depositDM(item.user.id_str, depositKey)})
            .then(() => {callback()})
            .catch((err) => {callback()});  // continue

        } else if (config.regexp.withdraw.test(item.text)) {
            console.log("withdraw!");
            callback();

        } else if (config.regexp.followme.test(item.text)) {
            console.log("followme!");
            followme(item.user.id_str)
            .then(() => {callback()})
            .catch((err) => {callback();});  // continue
        } else {
            callback();
        }

    }, function (error) {
        updateMentionId(mentionData[mentionData.length-1].id);
    });
}