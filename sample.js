const config = require('./config');

// const withdraw = require('./lisk/withdraw');
// withdraw("900864154793197568", 0, '5244341344295779314L', "", "tiplsk");

// const util = require('./util');
// console.log(util.calc(0.0000001, 0.0000002, "add"));

// const userCollection = require('./mongo/user');
// //userCollection.find({twitterId:"1052365035895283712"});

// const historyCollection = require('./mongo/history');
// historyCollection.insert({twitterId: 'test', amount: 1, type: 0, targetNm: 'test2'});

// const limitCtrlCollection = require('./mongo/limitCtrl');
// limitCtrlCollection.update(config.twitter.tweet.name);

// const mentionIdCollection = require('./mongo/mentionId');
// mentionIdCollection.update("test");

// const trxIdCollection = require('./mongo/trxId');
// trxIdCollection.update("test");

// const checkMention = require('./checkMention');
// checkMention();

// const checkReceive = require('./checkReceive');
// checkReceive();

// var params = {
//     track: "@tiplsk",
//     language: "ja"
// }
// config.TwitterClient.stream('statuses/filter', params)
// .on("start", response => console.log(`stream start: status=${response.status}`))
// .on("data", data => {
//     console.log(!data.retweeted_status);
//     console.log(data.text);
//     console.log(data.entities.user_mentions);
// })
// .on("ping", () => console.log("ping ok"))
// .on("error", error => console.log(error))
// .on("end", _response => console.log("stream end"));