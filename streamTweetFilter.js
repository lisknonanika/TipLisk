const config = require('./config');
const util = require('./util');
const allocate = require('./allocate');

module.exports = function(){
    // console.log(config.filter);
    config.TwitterClient.stream('statuses/filter', config.filter)
    .on("start", response => console.log(`stream start: status=${response.status}`))
    .on("data", data => {
        allocate(data)
        .catch((err) => {console.log("[" + util.getDateTimeString() + "]" + err)});
    })
    // .on("ping", () => console.log("ping ok"))
    .on("error", error => console.log("[" + util.getDateTimeString() + "]" + error))
    .on("end", _response => console.log("[" + util.getDateTimeString() + "]stream end"));
}
