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
    "tip": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(tip:e|tip|send|チップ)\s+(@|＠)[0-9a-zA-Z_]{5,15}\s+([1-9][0-9]{0,4}|0)(\.\d{1,5})?($|\s)/i),
    "tip_s": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(tip:e|tip|send|チップ)\s+([1-9][0-9]{0,4}|0)(\.\d{1,5})?($|\s)/i),
    "balance": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(balance:e|balance|残高|所持金)($|\s)/i),
    "deposit": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(deposit:e|deposit|入金)($|\s)/i),
    "withdraw": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(withdraw:e|withdraw|出金|送金)\s+[0-9]{1,}L\s+([1-9][0-9]{0,4}|0)(\.\d{1,8})?($|\s)/i),
    "followme": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(followme|フォローして)($|\s)/i),
    "history": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(history:e|history|履歴)($|\s)/i)
}
define('regexp', regexp);

var filter = {
    track: "@tiplsk tip,@tiplsk send,@tiplsk チップ," +
           "@tiplsk balance,@tiplsk 残高,@tiplsk 所持金," +
           "@tiplsk deposit,@tiplsk 入金," +
           "@tiplsk withdraw,@tiplsk 出金,@tiplsk 送金," +
           "@tiplsk followme,@tiplsk フォローして," +
           "@tiplsk history,@tiplsk 履歴"
}
define('filter', filter);

var liskExplorer = config.mode === 'test'? "https://testnet-explorer.lisk.io/tx/":
                                           "https://explorer.lisk.io/tx/";
var message = {
    "tipOk": ["{0} さんへ\n\n{1} さんから {2} チップが届きました！",
              "{0} さんへ\n\n{1} さんが {2} くれましたよ！",
              "{0} さんへ\n\n{1} さんが {2} チップをくれたみたい。",
              "{0} さんへ\n\n{2} {1}さんがくれたみたい。\nやったね！",
              "{0} さんへ\n\nなんと！\n{1} さんが {2} くれましたよ！",
              "{0} さんへ\n\n{1} さんからチップだよ！\n（ ・ω・）つ【{2}】",
              "{0} さんへ\n\n{1} さんが {2} くれるみたいですよ！",
              "{0} さんへ\n\n{1} さんが {2} くれましたー！",
              "{0} さんへ\n\n{1} さんがあなたにって {2} くれましたよ？\n今日は何かのお祝いですか？",
              "{0} さんへ\n\nやったやん！\n{1} さんから {2} 届いたで！",
              "{0} さんへ\n\n{1} さんから {2} だーよー！",
              "{0} さんへ\n\n{2} が {1} さんから届きました！",
              "{0} さんへ\n\nおぉ！？\n{1} さんが {2} くれたよ！"],
    "tipError": ["残高不足のためチップを渡せませんでした。",
                 "残高が不足しているみたいですよ？",
                 "ごめんなさい！\n残高が足りない時はチップを渡せないんです！",
                 "ん？間違っちゃいましたか？",
                 "残高が足りない時はチップ渡せないって知りませんでした？",
                 "チップむーりー。\n残高足りないよ～。",
                 "ちょいちょい！\n残高より多く渡せへんで！",
                 "ごめんなぁ。。\n残高たりひんみたいやわぁ。。"],
    "withdrawDM": ["{0}LSK を {1} へ送金しました。\n" +
                   "承認状況はLisk Explorer等で確認してください。\n" +
                   liskExplorer + "{2}"],
    "withdrawError": ["残高不足のため出金できませんでした。",
                      "出金できないみたい。\nLiskの手数料もあるから注意してね？",
                      "ごめんなさい！\n残高より多い枚数は出金できないんです！",
                      "ん？間違っちゃいましたか？\n残高より多いみたいですよ？",
                      "そんなに出金できるほど持ってないでしょ？",
                      "出金？\nムリムリ",
                      "出金するにはちょーっと足りひんみたいやわぁ。。"],
    "balanceDM": ["残高は {0} です。\n出金時はLiskの送金手数料がかかるのでご注意ください。",
                  "残高は {0} だよ！\n出金するときはLiskの送金手数料がかかるから注意してね？"],
    "depositDM": ["入金の際は発行されたKEYをトランザクションのメモ欄に入力してください。\n" +
                  "入力のし忘れ、間違いは対応できない可能性があるのでご注意ください。\n" +
                  "・KEY：{0}\n・入金先：{1}"],
    "receiveDM": ["{0}LSK 入金を確認しました。\n" +
                  "承認状況はLisk Explorer等で確認してください。\n" +
                  "Received {1}LSK.\n" +
                  "Please confirm the approval status with Lisk Explorer etc.\n" +
                  liskExplorer + "{2}"],
    "tipOk_e": ["Hi {0}！\n\n{1} sent you {2}！",
                "Hi {0}！\n\n{1} sent you {2}！\nIs today your anniversary？",
                "Hi {0}！\n\n{1} sent you {2}！\ngood for you！",
                "Hi {0}！\n\nYou got {2} from {1}.",
                "Hi {0}！\n\nWow！\nYou got {2} from {1}."],
    "tipError_e": ["You do not have enough LSK..",
                   "Oops！ Can not send LSK.\nBecause You do not have enough LSK..",
                   "Could not do it！\nPlease check your balance."],
    "withdrawDM_e": ["Sent {0}LSK to {1}.\n" +
                     "Please confirm the approval status with Lisk Explorer etc.\n" +
                     liskExplorer + "{2}"],
    "withdrawError_e": ["You do not have enough LSK..",
                        "Oops！ Can not send LSK.\nBecause You do not have enough LSK..",
                        "Could not do it！\nPlease check your balance."],
    "balanceDM_e": ["You have {0}!\nIf you transfer LSK to your Lisk address, a fee will be charged."],
    "depositDM_e": ["When depositing LSK, please enter the issued KEY in the reference field of the transaction.\n" +
                    "・KEY：{0}\n・ADDRESS：{1}\n\n" +
                    "[Notes]\nIf you forget to enter the KEY or wrong it, I may not be able to cope."],
    "random": ["\n",
               "\n\ntiplskって？：https://lisknonanika.github.io/tiplisk/",
               "\n\ntiplskの使い方：https://lisknonanika.github.io/tiplisk/howto.html"],
    "random_e": ["\n",
                 "\n\nwhat's tiplsk？：https://lisknonanika.github.io/tiplisk/",
                 "\n\nhow to tiplsk：https://lisknonanika.github.io/tiplisk/howto.html"]
}
define('message', message);