const async = require('async');
const config = require('./config');
const followme = require('./twitter/followme')

module.exports = function(){
    getFollowers()
    .then(() => {return getFriends()})
    .then(() => {return followBack()})
    .catch((err) => {console.log(err)});
}

var followers = [];
function getFollowers() {
    return new Promise(function(resolve, reject){
        config.TwitterClient.get('application/rate_limit_status', {resources: "followers"})
        .then((result) => {
            console.log(result.resources.followers['/followers/ids']);
            if (result.resources.followers['/followers/ids'].remaining === 0) return;
            config.TwitterClient.get('followers/ids', {stringify_ids: true, count: 5000})
            .then((result) => {
                if (!result) {
                    reject("no follower");
                    return;
                }
                followers = result.ids;
                resolve();
            })
            .catch((err) => {reject(err)});
        })
        .catch((err) => {reject(err)});
    });
}

var friends = [];
function getFriends() {
    return new Promise(function(resolve, reject){
        config.TwitterClient.get('application/rate_limit_status', {resources: "friends"})
        .then((result) => {
            console.log(result.resources.friends['/friends/ids']);
            if (result.resources.friends['/friends/ids'].remaining === 0) return;
            config.TwitterClient.get('friends/ids', {stringify_ids: true, count: 5000})
            .then((result) => {
                if (!result) friends = [];
                else friends = result.ids;
                resolve();
            })
            .catch((err) => {reject(err)});
        })
        .catch((err) => {reject(err)});
    });
}

function followBack() {
    return new Promise(function(resolve, reject){
        async.each(followers,  function(id, callback){
            if (friends.indexOf(id) < 0) {
                friends.push(id);
                console.log(id);
                followme(id)
                .then(() => {callback()})
                .catch((err) => {
                    console.log(err);
                    callback();
                });
            } else {
                callback();
            }
        }, function (error) {
            resolve();
        });
    });
}