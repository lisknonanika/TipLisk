const dateformat = require('dateformat');
const withdraw = require('./lisk/withdraw');
const updateuser = require('./mongo/updateuser');

//withdraw(0,'5244341344295779314L', '1234567890');
const execDate = dateformat(new Date(), 'yyyy/mm/dd HH:MM:ss');
updateuser(0,'1234567890', 0, "987654321L", execDate);
//updateuser(0,'1234567890L');