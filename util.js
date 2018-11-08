const shuffle = require('shuffle-array');
const Decimal = require('decimal');
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
  text = this.formatString(text, params);
  text = config.mode === "test"? text + "\n\n※Testnetで実行中です。ご注意ください。": text;
  return text;
}

module.exports.getDateTime = function(addminutes) {
  var d = new Date();
  if (addminutes) d.setMinutes(d.getMinutes() + addminutes);
  return d;
}

module.exports.num2str = function(num) {
  var arr = num.toString().split('e');
  if(arr.length === 1) return arr[0];
  var prec = arr[0].indexOf('.');
  if (0 < prec ) arr[1] -= prec ;
  return Number(num).toFixed(Math.abs(arr[1]));   
}

module.exports.calc = function(num1, num2, type) {
  var fix = getFix(num1, num2);
  var n1 = num1;
  var n2 = num2;
  if (fix > 0) {
    n1 = Decimal(this.num2str(n1)).mul(Math.pow(10,fix));
    n2 = Decimal(this.num2str(n2)).mul(Math.pow(10,fix));
  }
  var result = 0;
  var decp = 0;
  if(type==='add') {
    result = Decimal(n1).add(n2);
    decp = Math.pow(10,fix);

  } else if (type === 'sub') {
    result = Decimal(n1).sub(n2);
    decp = Math.pow(10,fix);

  } else if (type === 'mul') {
    result = Decimal(n1).mul(n2);
    decp = Math.pow(Math.pow(10,fix),2);

  } else if (type === 'div') {
    result = Decimal(n1).div(n2);
    decp = 1;
  }
  return fix > 0? this.num2str(Decimal(result).div(decp)): this.num2str(result);
}

function getFix(num1, num2) {
  var exp1 = getExp(num1);
  var exp2 = getExp(num2);
  var fix = 0;
  if(exp1 < 0 || exp2 < 0) {
    fix = +exp1 < +exp2? exp1: exp2;
  }
  return Math.abs(fix);
}

function getExp(num) {
  var arr = num.toString().split('e');
  if(arr.length === 1) return Decimal(num).as_int.exp;
  var prec = arr[0].indexOf('.');
  if (0 < prec) arr[1] -= prec;
  return arr[1];   
}