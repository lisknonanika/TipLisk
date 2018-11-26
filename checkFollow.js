const async = require('async');
const config = require('./config');
const util = require('./util');
const follow = require('./twitter/follow');
const userShow = require('./twitter/userShow');
const friendsCollection = require('./mongo/friends');

var friends = [];
var followers = [];
var localFriends = [];
module.exports = function(){
    getFriends()
    .then(() => {return getFollowers()})
    .then(() => {return reflesh()})
    .then(() => {return execute(followers.pop())})
    .catch((err) => {
        console.log("[" + util.getDateTimeString() + "] Main");
        console.log(err);
    });
}

var getFriends = function() {
    return new Promise(function(resolve, reject){
        config.TwitterClient.get('application/rate_limit_status', {resources: "friends"})
        .then((result) => {
            // console.log("[/friends/ids] " + JSON.stringify(result.resources.friends['/friends/ids']));
            if (result.resources.friends['/friends/ids'].remaining === 0) {
                console.log("[" + util.getDateTimeString() + "] /friends/ids limit");
                return;
            }
            config.TwitterClient.get('friends/ids', {stringify_ids: true, count: 5000})
            .then((result) => {
                if (!result) friends = [];
                else friends = result.ids;
                resolve();
            })
            .catch((err) => {
                console.log("[" + util.getDateTimeString() + "] getFriends");
                console.log(err);
                reject(err);
            });
        })
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "] getFriends");
            console.log(err);
            reject(err);
        });
    });
}

var getFollowers = function() {
    return new Promise(function(resolve, reject){
        config.TwitterClient.get('application/rate_limit_status', {resources: "followers"})
        .then((result) => {
            // console.log("[/followers/ids] " + JSON.stringify(result.resources.followers['/followers/ids']));
            if (result.resources.followers['/followers/ids'].remaining === 0) {
                console.log("[" + util.getDateTimeString() + "] /followers/ids limit");
                return;
            }
            config.TwitterClient.get('followers/ids', {stringify_ids: true, count: 5000})
            .then((result) => {
                if (!result) {
                    reject("no follower");
                    return;
                }
                followers = result.ids;
                resolve();
            })
            .catch((err) => {
                console.log("[" + util.getDateTimeString() + "] getFollowers");
                console.log(err);
                reject(err);
            });
        })
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "] getFollowers");
            console.log(err);
            reject(err);
        });
    });
}

var reflesh = function() {
    return new Promise(function(resolve, reject){
        localFriends = [];
        friendsCollection.find({})
        .then((result) => {
            if (result.length === 0) resolve();
            else {
                async.each(result, function(item, callback){
                    if (item.friend === 1 && friends.indexOf(item.twitterId) < 0) {
                        console.log("[" + util.getDateTimeString() + "]remove：" + item.twitterId);
                        friendsCollection.delete({twitterId: item.twitterId})
                        .then(() => {callback()})
                        .catch(() => {callback()});
                    } else if (item.friend === 0 && friends.indexOf(item.twitterId) >= 0) {
                        localFriends.push(item.twitterId);
                        friendsCollection.update({twitterId: item.twitterId}, {$set:{twitterId: item.twitterId, friend: 1}})
                        .then(() => {callback()})
                        .catch(() => {callback()});
                    } else {
                        localFriends.push(item.twitterId);
                        callback();
                    }
                }, function (error) {
                    if (error) {
                        console.log("[" + util.getDateTimeString() + "] reflesh");
                        console.log(error);
                    }
                    resolve();
                });
            }
        });
    });
}

var execute = function(twitterId) {
    return new Promise(function(resolve, reject){
        var friend = 0;

        if (localFriends.length > 0 && localFriends.indexOf(twitterId) >= 0) {
            if (followers.length > 0) return execute(followers.pop());
            else resolve();
        } else {
            findFriends(twitterId)
            .then(() => {return isTarget(twitterId)})
            .then((result) => {
                friend = result;
                if (result) return follow(twitterId);
            })
            .then(() => {return friendsCollection.update({twitterId: twitterId}, {$set:{twitterId: twitterId, friend: friend}})})
            .then(() => {
                if (followers.length > 0) return execute(followers.pop());
                else resolve();
            })
            .catch((err) => {
                if (err && err !== "already friends!") {
                    console.log("[" + util.getDateTimeString() + "] execute");
                    console.log(err);
                }
                if (followers.length > 0) return execute(followers.pop());
                else resolve();
            });
        }
    });
}

var findFriends = function(twitterId) {
    return new Promise(function(resolve, reject){
        friendsCollection.find({twitterId: twitterId})
        .then((result) => {
            if (result.length === 0) resolve();
            else reject("already friends!");
        });
    });
}

var isTarget = function(twitterId) {
    return new Promise(function(resolve, reject){
        userShow(twitterId)
        .then((result) => {
            if (result && result.protected && !result.following && !result.follow_request_sent) resolve(1);
            else resolve(0);
        });
    });
}