# tiplisk
TipLisk - LSK Tip Bot

## License
MIT License

## Bot Settings
### 1. ```./config/default.json, release.json```
- **```mode```:** test or release
- **```lisk.address```:**
  - チップBOT用Liskアドレスを設定。
  <br>enter the Lisk Address for Tip Bot.
  
- **```lisk.passphrase```:**
  - チップBOT用Liskアドレスのパスフレーズを設定。
  <br>enter the Lisk passphrase for Tip Bot.
  
- **```lisk.secondPassphrase```:**
  - チップBOT用Liskアドレスのセカンドパスフレーズを設定。(設定していない場合は空欄でOK)
  <br>enter the Lisk secondPassphrase for Tip Bot. (optional)
  
- **```lisk.transactionLimit```:**
  - Liskトランザクションの最大取得件数を設定。
  <br>enter the maximum number of transaction.(MAX:100)

- **```mongo.url```:**
  - MongoDBのURLを設定。
  <br>enter the MongoDB URL.
- **```mongo.db:```:**
  - MongoDBのデータベース名を設定。
  <br>enter the database name.
- **```mongo.user```:**
  - MongoDBのデータベースへ接続するread / write権限のあるユーザー名を設定。
  <br>enter the user with read / write authority.
- **```mongo.password```:**
  - MongoDBのデータベースへ接続するユーザーのパスワードを設定。
  <br>enter the password.
- **```mongo.collectionUser```:**
  - サービス利用者を管理するコレクション名を設定。
  <br>enter collection name to manage user.
- **```mongo.collectionHistory```:**
  - 入出金履歴を管理するコレクション名を設定。
  <br>enter collection name to manage deposit / withdraw / tip.
- **```mongo.collectionLiskTrx```:**
  - 処理済みのLiskトランザクションのIDを管理するコレクション名を設定。
  <br>enter collection name to manage latest transactionID.
- **```mongo.collectionMentionId```:**
  - 処理済みのTweetIDを管理するコレクション名を設定。
  <br>enter collection name to manage latest tweetID.
- **```mongo.collectionLimitCtrl```:**
  - TwitterAPIの実行回数を管理するコレクション名を設定。
  <br>enter collection name to manage twitterAPI limit.
- **```mongo.collectionFriends```:**
  - TipBotをフォローしているユーザーを管理するコレクション名を設定。
  <br>enter collection name to manage follower.

- **```twitter.apiKey```:**
  - Twitter Developer登録して発行されたAPI Keyを設定。
  <br>enter the twitter-developers apiKey.
- **```twitter.apiSecret```:**
  - Twitter Developer登録して発行されたAPI Secretを設定。
  <br>enter the twitter-developers apiSecret.
- **```twitter.accessToken```:**
  - Twitter Developer登録して発行されたAccess Tokenを設定。
  <br>enter the twitter-developers accessToken.
- **```twitter.accessTokenSecret```:**
  - Twitter Developer登録して発行されたAccess Token Secretを設定。
  <br>enter the twitter-developers accessTokenSecret.
- **```twitter.mention```:**
  - TwitterAPI 'statuses/mentions_timeline' で取得する件数を設定。
  <br>TwitterAPI 'statuses/mentions_timeline' settings. 
- **```twitter.tweet```:**
  - TwitterAPI 'statuses/update' の指定時間あたりの最大実行回数を設定。(mongo.collectionLimitCtrlで管理)
  <br>TwitterAPI 'statuses/update' settings. manage with　mongo.collectionLimitCtrl.
- **```twitter.dm```:**
  - TwitterAPI 'direct_messages/events/new' の指定時間あたりの最大実行回数を設定。(mongo.collectionLimitCtrlで管理)
  <br>TwitterAPI 'direct_messages/events/new' settings. manage with　mongo.collectionLimitCtrl.
- **```twitter.follow```:**
  - TwitterAPI 'friendships/create' の指定時間あたりの最大実行回数を設定。(mongo.collectionLimitCtrlで管理)
  <br>TwitterAPI 'friendships/create' settings. manage with　mongo.collectionLimitCtrl.

### 2. ```config.js```
- ツイート内容やDMの内容を設定。
<br>Set contents of tweet and DM.
- ツイートの検索文字列を設定。
<br>Set tweet filter.
- ブラックリスト(コマンドを処理しないTwitterアカウント)を設定。
<br>Set blacklist.

## Run the Bot
- **```streamTweetFilter.js```:**
  - TwitterAPI 'statuses/filter' を使用して、コマンドを即時実行する。
  <br>Immediate Processing on receive mention. using TwitterAPI 'statuses/filter'.
- **```checkMention.js```:**
  - 鍵アカウントからのコマンドを実行する。(PM2等で定期的に実行することを推奨)
  <br>Process protected tweet. Recommend periodic execution using pm2 etc.
- **```checkFollow.js```:**
  - 鍵アカウントにフォローされた場合のフォローバックを行う。(PM2等で定期的に実行することを推奨)
  <br>Follow back private account. Recommend periodic execution using pm2 etc.
- **```checkReceive.js```:**
  - Liskトランザクションを監視し、TipBotへ入金があった場合の処理を行う。(PM2等で定期的に実行することを推奨)
  <br>Monitor lisk transaction and process deposit. Recommend periodic execution using pm2 etc.
