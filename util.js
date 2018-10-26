module.exports.isNumber = function(val){
  var regex = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
  return regex.test(val);
}