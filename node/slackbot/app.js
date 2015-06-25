var token = require('./token');
// ------------------
// cron-emitter
// https://www.npmjs.com/package/cron-emitter
var CronEmitter = require("cron-emitter").CronEmitter;
var emitter = new CronEmitter();
var request = require('request');
var moment = require('moment-timezone');
var now = new Date();
var counter10s = 0;
var Slack = require('node-slack');
// Incoming WebHooks
var slack = new Slack(token.webhook);

console.log('emitter bit_survey and btc_xxx')

emitter.add("15 */30 * * * *", "bit_survey");
emitter.add("25 */20 * * * *", "btc_usd");

function post2webhook(msg) {
    slack.send({
        text: msg,
        channel: '#bitcointalk',
        icon_emoji: ":ghost:",
        username: 'RedBot'
    });
}

function post2slackbot(msg) {
    request({
        uri: token.slackbot,
        method: 'POST',
        body: msg
    }, function(err, res, body) {
        if (err) console.log(err)
        console.log(body)
    })
}

emitter.on("btc_usd", function() {
    "use strict";
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
            post2webhook(out)
        }
    })
});


//
//  { fid: '5968e0137xxxx0d89517', name: 'xxx問卷', descr: '18題',
//  url: 'https://docs.google.com/forms/d/1jMixxxx', reward_point: 0.8,  remain_point: 51.2, account: 'testxxx' }
//

emitter.on("bit_survey", function() {
    "use strict";
    request('http://www.bit-survey.com/api/db_api/select/form_all.php', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            var r = info['result'];
            var a = [moment().tz("Asia/Taipei").format(), r.length + '張問卷 '];
            r.forEach(function(e, index, arr) {
                console.log(e);
                a.push(e['name'] + ',' + e['reward_point'] + 'mBTC');
            });
            a.push('http://www.bit-survey.com/pages/fill_survey.html')
            var out = a.join(' | ')
            console.log(out)
            post2webhook(out)
        }
    })
});

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/yesman',function(req,res) {
    console.log(req.body);
    // Slash Commands
    // token=xxxxxxxxiL0Zv
    // team_id=T0001
    // team_domain=example
    // channel_id=C2147483705
    // channel_name=test
    // user_id=U2147483697
    // user_name=Steve
    // command=/weather
    // text=94070
    res.send('Good Job '+ req.body.user_name);
});


var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Express app listening at http://%s:%s', host, port);

});
