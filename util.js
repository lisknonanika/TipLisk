const Decimal = require('decimal');
const shuffle = require('shuffle-array');
const config = require('./config');

module.exports.isNumber = function(val){
  var regex = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
  return regex.test(val);
}

module.exports.formatString = function(msg, params) {
    for (i = 0; i < params.length; i++) {
      msg = msg.replace("{" + i + "}", params[i]);
    }
    return msg;
}

module.exports.getMessage = function(messages, params) {
  var text = shuffle(messages, {'copy': true})[0];
  text = config.mode === "test"? text + "\n\n※Testnetで実行中です。ご注意ください。": text;
  return this.formatString(text, params);
}

module.exports.getDateTime = function(addminutes) {
  var d = new Date();
  if (addminutes) d.setMinutes(d.getMinutes() + addminutes);
  return d;
}

module.exports.number2String = function(num) {
  var arr = num.toString().split('e');
  if(arr.length === 1) return arr[0];
  var prec = arr[0].indexOf('.');
  if (0 < prec ) arr[1] -= prec ;
  return Number(num).toFixed(Math.abs(arr[1]));   
}

module.exports.plus = function(num1, num2) {
  return Decimal(this.number2String(num1)).add(this.number2String(num2)).toNumber();
}

module.exports.minus = function(num1, num2) {
  return Decimal(this.number2String(num1)).sub(this.number2String(num2)).toNumber();
}

module.exports.multiply = function(num1, num2) {
  return Decimal(this.number2String(num1)).mul(this.number2String(num2)).toNumber();
}

module.exports.divide = function(num1, num2) {
  return Decimal(this.number2String(num1)).div(this.number2String(num2)).toNumber();
}