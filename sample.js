const config = require('./config');
const updateUser = require('./mongo/updateUser');
const insertHistory = require('./mongo/insertHistory');
const withdraw = require('./lisk/withdraw');
const checkreceive = require('./checkReceive');
const checkMention = require('./checkMention');
const updateLimitCtrl = require('./mongo/updateLimitCtrl');
const tweet = require('./twitter/tweet');

//withdraw("900864154793197568", 0, '5244341344295779314L', "", "");
//tweet("test",null,null);
//checkreceive();
checkMention();
