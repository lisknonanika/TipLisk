const dateformat = require('dateformat');
const withdraw = require('./withdraw');
const checkreceive = require('./checkReceive');
const updateUser = require('./mongo/updateUser');

//withdraw(0.0001,'5244341344295779314L', '1234567890');
//updateUser(0,'1234567890', 0, "987654321L", dateformat(new Date(), 'yyyy/mm/dd HH:MM:ss'));
checkreceive('3515766598771340083');