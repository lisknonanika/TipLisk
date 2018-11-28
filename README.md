# tiplisk
TipLisk - LSK Tip Bot

## License
MIT License

## Bot Settings
### 1. ```./config/default.json, release.json```
- **```mode```:** test or release
- **```lisk.address```:** enter the Lisk Address for Tip Bot.
- **```lisk.passphrase```:** enter the Lisk passphrase for Tip Bot.
- **```lisk.secondPassphrase```:** enter the Lisk secondPassphrase for Tip Bot. (optional)
- **```lisk.transactionLimit```:** enter the maximum number of transaction.(MAX:100)

- **```mongo.url```:** enter the MongoDB URL.
- **```mongo.db:```:** enter the database name.
- **```mongo.user```:** enter the user with read / write authority.
- **```mongo.password```:** enter the password.
- **```mongo.collectionUser```:** enter collection name to manage user.
- **```mongo.collectionHistory```:** enter collection name to manage deposit / withdraw / tip.
- **```mongo.collectionLiskTrx```:** enter collection name to manage latest transactionID.
- **```mongo.collectionMentionId```:** enter collection name to manage latest tweetID.
- **```mongo.collectionLimitCtrl```:** enter collection name to manage twitterAPI limit.
- **```mongo.collectionFriends```:** enter collection name to manage follower.

- **```twitter.apiKey```:** enter the twitter-developers apiKey.
- **```twitter.apiSecret```:** enter the twitter-developers apiSecret.
- **```twitter.accessToken```:** enter the twitter-developers accessToken.
- **```twitter.accessTokenSecret```:** enter the twitter-developers accessTokenSecret.
- **```twitter.mention```:** twitterAPI 'statuses/mentions_timeline' settings. 
- **```twitter.tweet```:** twitterAPI 'statuses/update' settings. manage with　mongo.collectionLimitCtrl.
- **```twitter.dm```:** twitterAPI 'direct_messages/events/new' settings. manage with　mongo.collectionLimitCtrl.
- **```twitter.follow```:** twitterAPI 'friendships/create' settings. manage with　mongo.collectionLimitCtrl.

### 2. ```config.js```
- Set contents of tweet and DM.
- Set tweet filter.
- Set blacklist.
