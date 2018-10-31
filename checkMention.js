const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const Decimal = require('decimal');
const shuffle = require('shuffle-array');
const config = require('./config');
const util = require('./util');
const updateUser = require('./mongo/updateUser');
const updateMentionId = require('./mongo/updateMentionId');
const tweet = require('./twitter/tweet');
const getBalance = require('./mongo/getBalance');
const depositDM = require('./twitter/depositDM');
const followme = require('./twitter/followme');
const withdraw = require('./lisk/withdraw');

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
        if (config.blacklist.indexOf(item.user.id_str) >= 0) {
            callback();
            return;
        }

        // allocate
        if (config.regexp.tip.test(item.text)) {
            console.log("tip!");
        } else if (config.regexp.tip_s.test(item.text)) {
            if (!item.in_reply_to_user_id_str) callback();
            console.log("tip!");

        } else if (config.regexp.balance.test(item.text)) {
            console.log("balance!");
            getBalance(item.user.id_str)
            .then((balance) => {
                var text = shuffle(config.message.balance, {'copy': true})[0];
                text = util.formatString(text, [balance]);
                return tweet(text, item.id_str, item.user.screen_name);
            })
            .then(() => {callback()})
            .catch((err) => {callback()});  // continue

        } else if (config.regexp.deposit.test(item.text)) {
            console.log("deposit!");
            updateUser(0, item.user.id_str)
            .then(() => {return depositDM(item.user.id_str)})
            .then(() => {callback()})
            .catch((err) => {callback()});  // continue

        } else if (config.regexp.withdraw.test(item.text)) {
            console.log("withdraw!");
            var commands = item.text.match(config.regexp.withdraw)[0].split(/\s/);
            withdraw(item.user.id_str, Decimal(commands[3]).toNumber(), commands[2], item.id_str, item.user.screen_name)          
            .then(updateUser(Decimal(commands[3]).div(-1).toNumber(), item.user.id_str))
            .then(insertHistory(Decimal(commands[3]).toNumber(), item.user.id_str, 0, commands[2]))
            .then(() => {callback()})
            .catch((err) => {callback()});  // continue

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