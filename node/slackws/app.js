/////////////////////////////////
//     +-+-+-+-+-+-+-+-+-+     //
//     |Y|1|2|S|T|U|D|I|O|     //
//     +-+-+-+-+-+-+-+-+-+     //
//     2015        y12.tw      //
/////////////////////////////////

var token = require('./token');
// ------------------
// cron-emitter
// https://www.npmjs.com/package/cron-emitter
var CronEmitter = require("cron-emitter").CronEmitter;
var emitter = new CronEmitter();
var request = require('request');
var moment = require('moment-timezone');
var now = new Date();

emitter.add("25 */10 * * * *", "btc_usd");

var btcusd_result = '';

function reqBtcusd() {
    // https://api.bitcoinaverage.com/ticker/global/all
    request('https://api.bitcoinaverage.com/ticker/global/all', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            var a = [moment().tz("Asia/Taipei").format()];
            ['TWD', 'USD', 'CNY'].forEach(function(e, index, arr) {
                var v = info[e];
                a.push('BTC' + e + ' ' + v['last']);
            });
            a.push('https://bitcoinaverage.com/')
            var out = a.join(' | ')
            console.log(out)
            btcusd_result = out
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
	if(typeof data.text == 'undefined') return;
	// If someone says 'cake!!' respond to their message with "@user OOH, CAKE!! :cake"
	if(data.text === 'cake!!') slack.sendMsg(data.channel, "@"+slack.getUser(data.user).name+" OOH, CAKE!! :cake:")

	// If the first character starts with %, you can change this to your own prefix of course.
	if(data.text.charAt(0) === '%') {
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
				slack.sendMsg(data.channel, "Oh, hello @"+slack.getUser(data.user).name+" !")
			break;

            case "btcusd":
                slack.sendMsg(data.channel, "@"+slack.getUser(data.user).name+" : " + btcusd_result)
            break;

			case "hue":
				slack.sendMsg(data.channel, "@"+slack.getUser(data.user).name+" brbrbrbrbrb!")
			break;

			case "say":
				var say = data.text.split('%say ');
				slack.sendMsg(data.channel, say[1]);
			break;

			case "debug":
				console.log(slack.data);
			break;
		}
	}
});
