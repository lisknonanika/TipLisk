const updateUser = require('./mongo/updateUser');
const insertHistory = require('./mongo/insertHistory');
const withdraw = require('./lisk/withdraw');
const checkreceive = require('./checkReceive');
const checkMention = require('./checkMention');
const updateLimitCtrl = require('./mongo/updateLimitCtrl');

//withdraw(100000000, '5244341344295779314L')
// .then(updateUser(100000000, '1052365035895283712'))
// .then(insertHistory(100000000, '1052365035895283712', 0, '5244341344295779314L'))
// .then(function(){callback();})
// .catch(function(err){callback(err);});

//checkreceive();
checkMention();