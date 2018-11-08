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
    "receivekey": new RegExp(/(^[0-9a-zA-Z]{12,12}$)|(^[0-9a-zA-Z]{24,24}$)/),
    "tip": new RegExp(/(^|\s)@tiplsk\s(tip|send|チップ)\s@[0-9a-zA-Z_]{5,15}\s([1-9][0-9]{0,4}|0)(\.\d{1,5})?($|\s)/),
    "tip_s": new RegExp(/(^|\s)@tiplsk\s(tip|send|チップ)\s([1-9][0-9]{0,4}|0)(\.\d{1,5})?($|\s)/),
    "balance": new RegExp(/(^|\s)@tiplsk\s(balance|残高|所持金)($|\s)/),
    "deposit": new RegExp(/(^|\s)@tiplsk\s(deposit|入金)($|\s)/),
    "withdraw": new RegExp(/(^|\s)@tiplsk\s(withdraw|出金|送金)\s[0-9]{1,}L\s([1-9][0-9]{0,8}|0)(\.\d{1,8})?($|\s)/),
    "followme": new RegExp(/(^|\s)@tiplsk\s(followme|フォローして)($|\s)/)
}
define('regexp', regexp);

var filter = {
    track: "@tiplsk tip, @tiplsk send, @tiplsk チップ, " +
           "@tiplsk balance, @tiplsk 残高, @tiplsk 所持金, " +
           "@tiplsk deposit, @tiplsk 入金, " +
           "@tiplsk withdraw, @tiplsk 出金, @tiplsk 送金, " +
           "@tiplsk followme, @tiplsk フォローして"
}
define('filter', filter);

var liskExplorer = config.mode === 'test'? "https://testnet-explorer.lisk.io/tx/":
                                           "https://explorer.lisk.io/tx/";
var message = {
    "tipOk": ["\n{0} さんから {1}LSK チップが届きました！",
              "\n{0} さんが {1}LSK くれましたよ！",
              "\n{0} さんがチップをくれたみたい。（{1}LSK）",
              "\n{1}LSK {0}さんがくれたみたい。\nやったね！",
              "\nなんと！\n{0} さんが {1}LSK くれましたよ！",
              "\n{0} さんからチップだよ！\nつ【{1}LSK】",
              "\n{0} さんが {1}LSK くれるみたいですよ！",
              "\n{0} さんが {1}LSK くれましたー！",
              "\n{0} さんがあなたにって {1}LSK くれましたよ？\n今日は何かのお祝いですか？",
              "\nやったやん！\n{0} さんから {1}LSK 届いたで！"],
    "tipError": ["\n残高不足のためチップを渡せませんでした。\n\n残高：{0}LSK",
                 "\n残高が不足しているみたいですよ？\n\n残高：{0}LSK",
                 "\nごめんなさい！\n残高が足りない時はチップを渡せないんです！\n\n残高：{0}LSK",
                 "\nん？間違っちゃいましたか？\n\n残高：{0}LSK",
                 "\n残高が足りない時はチップ渡せないって知りませんでした？\n\n残高：{0}LSK",
                 "\nチップむーりー\n\n残高：{0}LSK",
                 "\nちょいちょい！\n残高 {0}LSK なんやから無理やで！",
                 "\nごめんなぁ。。\n残高たりひんみたいやわぁ？\n\n残高：{0}LSK"],
    "withdrawDM": ["{0}LSK を {1} へ送金しました。\n" +
                   "承認状況はLisk Explorer等で確認してください。\n\n" +
                   liskExplorer + "{2}"],
    "withdrawError": ["\n残高不足のため出金できませんでした。\n\n出金可能：{0}LSK",
                      "\n出金できないみたい。\nLiskの手数料もあるから注意してね？\n\n出金可能：{0}LSK",
                      "\nごめんなさい！\n残高より多い枚数は出金できないんです！\n\n出金可能：{0}LSK",
                      "\nん？間違っちゃいましたか？\n\n出金可能：{0}LSK",
                      "\nそんなに出金できるほど持ってないでしょ？\n\n出金可能：{0}LSK",
                      "\n出金？\nムリムリ\n\n出金可能：{0}LSK",
                      "\n出金するにはちょーっと足りひんみたいやわぁ。。\n\n出金可能：{0}LSK"],
    "balance": ["\n残高は {0}LSK です。\n出金時はLiskの送金手数料がかかるのでご注意ください。",
                "\n残高は {0}LSK だよ！\n出金するときはLiskの送金手数料がかかるから注意してね？",
                "\n残高は {0}LSK みたい。",
                "\n残高は～。。\n{0}LSK？\nへー。",
                "\nんー？\n{0}LSK かな？",
                "\n{0}LSK だよ！",
                "\n{0}LSK やで～",
                "\nウチの調べによると、残高は {0}LSK みたいやで？",
                "\n残高はなんと！\n\n{0}LSK！"],
    "depositDM": ["入金の際は発行されたKEYをトランザクションのメモ欄に入力してください。\n" +
                  "入力のし忘れ、間違いは対応できない可能性があるのでご注意ください。\n" +
                  "・KEY：{0}\n・入金先：{1}"],
    "receiveDM": ["{0}LSK 入金を確認しました。\n" +
                  "承認状況はLisk Explorer等で確認してください。\n\n" +
                  liskExplorer + "{1}"]
}
define('message', message);