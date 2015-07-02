/////////////////////////////////
//     +-+-+-+-+-+-+-+-+-+     //
//     |Y|1|2|S|T|U|D|I|O|     //
//     +-+-+-+-+-+-+-+-+-+     //
//     2015        y12.tw      //
/////////////////////////////////

var token = require('./token');
var bot = require('./lib/bot');
// load math.js
var math = require('mathjs');
// ------------------
// cron-emitter
// https://www.npmjs.com/package/cron-emitter
var CronEmitter = require("cron-emitter").CronEmitter;
var emitter = new CronEmitter();
var request = require('request');
var moment = require('moment-timezone');
var now = new Date();

emitter.add("25 */10 * * * *", "btc_usd");

var btc_result = {};

function reqBtcusd() {
    // https://api.bitcoinaverage.com/ticker/global/all
    var apiurl = 'https://api.bitcoinaverage.com/ticker/global/all'
    request(apiurl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            var r = {};
            r.time = moment().tz("Asia/Taipei").format()
            r.twd = info.TWD.last
            r.usd = info.USD.last
            r.cny = info.CNY.last
            r.url = 'https://api.bitcoinaverage.com/ticker/global/all'
            console.log(JSON.stringify(r))
            btc_result = r;
        }
    })
}

emitter.on("btc_usd", function() {
    "use strict";
    reqBtcusd();
});

reqBtcusd();

// Requiring our module
var slackAPI = require('slackbotapi');

// Starting
var slack = new slackAPI({
    'token': token.botuser,
    'logging': true
});

// Slack on EVENT message, send data.
slack.on('message', function(data) {
    // If no text, return.
    if (typeof data.text == 'undefined') return;
    // If someone says 'cake!!' respond to their message with "@user OOH, CAKE!! :cake"
    if (data.text === 'cake!!') slack.sendMsg(data.channel, "@" + slack.getUser(data.user).name + " OOH, CAKE!! :cake:")

    // If the first character starts with ?, you can change this to your own prefix of course.
    if (data.text.charAt(0) === '?') {
        // Split the command and it's arguments into an array
        var command = data.text.substring(1).split(' ');

        // If command[2] is not undefined use command[1] to have all arguments in comand[1]
        if (typeof command[2] != "undefined") {
            for (var i = 2; i < command.length; i++) {
                command[1] = command[1] + ' ' + command[i];
            }
        }

        // Switch to check which command has been requested.
        switch (command[0].toLowerCase()) {
            // If hello
            case "hello":
                // Send message.
                slack.sendMsg(data.channel, "Oh, hello @" + slack.getUser(data.user).name + " !")
                break;

            case "btc":
                slack.sendMsg(data.channel, "@" + slack.getUser(data.user).name + " : " + JSON.stringify(btc_result))
                break;

            case "coin":
                var opt = bot.parsecmd(data.text);
                if (opt.mbtc) {
                    var result = (JSON.parse(JSON.stringify(btc_result)));
                    //console.log(result);
                    ['twd', 'usd', 'cny'].forEach(function(e, index, arr) {
                        result[e] = math.round(result[e] * opt.mbtc / 1000, 2);
                    });
                    result.mbtc = opt.mbtc;
                    slack.sendMsg(data.channel, JSON.stringify(result));
                } else if (opt.twd) {
                    var result = (JSON.parse(JSON.stringify(btc_result)));
                    var mbtc =  math.round(opt.twd / result.twd * 1000, 2);
                    result.mbtc = mbtc;
                    ['usd', 'cny'].forEach(function(e, index, arr) {
                        result[e] = math.round(result[e] * mbtc / 1000, 2);
                    });
                    result.twd = opt.twd;
                    slack.sendMsg(data.channel, JSON.stringify(result));

                } else {
                    slack.sendMsg(data.channel, opt.help ? bot.usage : JSON.stringify(opt));
                }
                break;

            case "mbtc":
                var p = bot.parsembtc(data.text);
                var target = {};
                if (p.error) {
                    target = p
                } else {
                    var amount = p.amount;
                    var result = (JSON.parse(JSON.stringify(btc_result)));
                    result.mbtc = amount;
                    //console.log(result);
                    ['twd', 'usd', 'cny'].forEach(function(e, index, arr) {
                        result[e] = math.round(result[e] * amount / 1000, 2);
                    });
                    target = result;
                }
                slack.sendMsg(data.channel, '@' + slack.getUser(data.user).name + ' : ' + JSON.stringify(target));
                break;

            case "hue":
                slack.sendMsg(data.channel, "@" + slack.getUser(data.user).name + " brbrbrbrbrb!")
                break;

            case "say":
                var say = data.text.split('?say ');
                slack.sendMsg(data.channel, say[1]);
                break;

            case "debug":
                console.log(slack.data);
                break;
        }
    }
});
