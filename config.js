const lisk = require('lisk-elements').default;
const twitter = require('twitter-lite');
const config = require('config');

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false
    });
}

define('mode', config.mode);
define('lisk', config.lisk);
define('twitter', config.twitter);
define('mongo', config.mongo);

var liskClient = config.mode === 'test'? lisk.APIClient.createTestnetAPIClient():
                                         lisk.APIClient.createMainnetAPIClient();
define('LiskClient', liskClient);

var twitterClient = new twitter({
    consumer_key: config.twitter.apiKey,
    consumer_secret: config.twitter.apiSecret,
    access_token_key: config.twitter.accessToken,
    access_token_secret: config.twitter.accessTokenSecret,
}); 
define('TwitterClient', twitterClient);

var mongoClientParams = {auth:{user: config.mongo.user, password: config.mongo.password},
                         authSource: config.mongo.db, useNewUrlParser: true}
define('mongoClientParams', mongoClientParams);

var blacklist = ["1052365035895283712"];
define('blacklist', blacklist);

var regexp = {
    "tip": new RegExp(/(^|\s)@tiplsk\s(tip|send|チップ)\s@[0-9a-zA-Z_]{5,15}\s[0-9]+(\.[0-9]+)?($|\s)/),
    "tip_s": new RegExp(/(^|\s)@tiplsk\s(tip|send|チップ)\s[0-9]+(\.[0-9]+)?($|\s)/),
    "balance": new RegExp(/(^|\s)@tiplsk\s(balance|残高|所持金)($|\s)/),
    "deposit": new RegExp(/(^|\s)@tiplsk\s(deposit|入金)($|\s)/),
    "withdraw": new RegExp(/(^|\s)@tiplsk\s(withdraw|出金)\s[0-9]+L\s[0-9]+(\.[0-9]+)?($|\s)/),
    "followme": new RegExp(/(^|\s)@tiplsk\s(followme|フォローして)($|\s)/)
}
define('regexp', regexp);

var message = {
    "tipError": ["残高不足のためチップを渡せませんでした。（残高：{0}LSK）",
                 "残高が不足しているみたいですよ？（残高：{0}LSK）",
                 "ごめんなさい！残高が足りない時はチップを渡せないんです！（残高：{0}LSK）",
                 "ん？間違っちゃいましたか？（残高：{0}LSK）",
                 "残高が足りない時はチップ渡せないって知りませんでした？（残高：{0}LSK）",
                 "チップむーりー（残高：{0}LSK）"],
    "withdrawError": ["残高不足のため出金できませんでした。（出金可能：{0}LSK）",
                      "出金できないみたい。Liskの手数料もあるから注意してね？（出金可能：{0}LSK）",
                      "ごめんなさい！残高より多い枚数は出金できないんです！（出金可能：{0}LSK）",
                      "ん？間違っちゃいましたか？（出金可能：{0}LSK）",
                      "そんなに出金できるほど持ってないでしょ？（出金可能：{0}LSK）",
                      "出金？ムリムリ（出金可能：{0}LSK）"],
    "balance": ["残高は{0}LSKです。出金時はLiskの送金手数料がかかるのでご注意ください。",
                "残高は{0}LSKだよ！出金するときはLiskの送金手数料がかかるから注意してね？",
                "残高は{0}LSKみたい。",
                "残高は～、{0}LSK？へー。",
                "んー？{0}LSKかな？"],
    "depositDM": ["入金の際は発行されたKEYをトランザクションのメモ欄に入力してください。\n" +
                  "入力のし忘れ、間違いは対応できない可能性があるのでご注意ください。\n" +
                  "・KEY：{0}\n・入金先：{1}"]
}
define('message', message);