const config = require('./config');
const allocate = require('./allocate');

module.exports = function(){
    // console.log(config.filter);
    config.TwitterClient.stream('statuses/filter', config.filter)
    .on("start", response => console.log(`stream start: status=${response.status}`))
    .on("data", data => {
        allocate(data)
        .catch((err) => {console.log(err)});
    })
    // .on("ping", () => console.log("ping ok"))
    .on("error", error => console.log(error))
    .on("end", _response => console.log("stream end"));
}
