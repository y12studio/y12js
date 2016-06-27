var tokenjson = require('./telegram.token.json')
var token = tokenjson.token;
var request = require('request');
var telegram = require('telegram-bot-api');
var util = require('util');
var emoji = require('node-emoji');

var CronJob = require('cron').CronJob;
var btctwd = {
    bitoex: {
        sell: 0,
        buy: 0
    },
    maicoin: {
        sell: 0,
        buy: 0
    }
}

Array.prototype.sample = function() {
    return this[Math.floor(Math.random() * this.length)];
}

emojiarr = ['heart', 'anchor', 'airplane', 'snowflake', 'relaxed', 'snowman', 'v', 'star', 'u7a7a', 'u6e80', 'rocket', 'coffee', 'shamrock'];

function toZhTw(j) {
    var b = j.bitoex;
    var m = j.maicoin;
    return util.format('bitoex 買%s賣%s平%s %s maicoin 買%s賣%s平%s', b.buy, b.sell, Math.round((b.buy + b.sell) / 2),
     emoji.get(emojiarr.sample()), m.buy, m.sell, Math.round((m.buy + m.sell) / 2));
}

// console.log(toZhTw(btctwd));

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
    console.log(r);
    btctwd.bitoex.buy = r.buy;
    btctwd.bitoex.sell = r.sell;
})

createJob('15 */2 * * * *', 'https://api.maicoin.com/v1/prices/twd', function(r) {
    console.log(r);
    btctwd.maicoin.buy = Math.round(parseFloat(r.buy_price));
    btctwd.maicoin.sell = Math.round(parseFloat(r.sell_price));
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
    // Messages that start with a slash ‘/’ (see Commands above)
    var result = toZhTw(btctwd);
    console.log(result);

    if (message.text.startsWith('/y12')) {
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
});
