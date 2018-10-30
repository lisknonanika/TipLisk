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