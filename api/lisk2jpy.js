const webclient = require('request');
const util = require('../util');

module.exports = function(amount) {
    return new Promise(function(resolve, reject){
        var options = {
            url: 'https://coincheck.com/api/rate/lsk_jpy',
            method: 'GET',
            json: true
        }
        webclient(options, function (err, res, body) {
            if (!err && res.statusCode == 200) resolve(Number(util.calc(amount, Number(body.rate).toFixed(3), "mul")).toFixed(3));
            else {
                console.log("can not get LSK_JPY");
                resolve("？");
            }
        });
    });
}