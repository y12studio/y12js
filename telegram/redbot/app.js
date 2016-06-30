var utils = require('./utils')
var tokenjson = require('./telegram.token.json')
var token = tokenjson.token;
var request = require('request');
var telegram = require('telegram-bot-api');
var btctwd = utils.btctwd

var CronJob = require('cron').CronJob;

function createJob(cronstr, url, cb) {
    new CronJob(cronstr, function() {
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var r = JSON.parse(body);
                cb(r);
            }
        })
    }, null, true, 'Asia/Taipei');
}

createJob('5 */2 * * * *', 'https://www.bitoex.com/api/v1/get_rate', function(r) {
    console.log(r)
    utils.updateBitoex(r)
})

createJob('15 */2 * * * *', 'https://api.maicoin.com/v1/prices/twd', function(r) {
    console.log(r)
    utils.updateMaicoin(r)
})

var api = new telegram({
    token: tokenjson.token,
    updates: {
        enabled: true
    }
});

api.on('message', function(message) {
    // Received text message
    console.log(message);

    var chat_id = message.chat.id;
    var chat_type = message.chat.type; // private or group
    var username = message.from.username;
    // group privacy mode
    // Messages that start with a slash ‘/’
    mtx = message.text

    if (mtx.startsWith('/y12')) {
        var result = utils.handleCmd(mtx, {
            chattype: chat_type,
            username:username,
            token:tokenjson.token
        })
        console.log(result);
        api.sendMessage({
                chat_id: chat_id,
                text: result
            })
            .then(function(message) {
                console.log(message);
            })
            .catch(function(err) {
                console.log(err);
            });
    }
})
