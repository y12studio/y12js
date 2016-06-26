var request = require('request');
var schedule = require('node-schedule');
var posturl = 'http://192.168.1.1/router/wire_bas_ap_set.cgi'
var formdata = {
    AP_SSID: 'Y12-haha168',
    wire_enable: 1,
    radio_criterion: 10,
    network_mode: 0,
    network_type: 0,
    channel_width: 4,
    br_enable: 1,
    wire_mac: '04:8D:38:E4:51:59',
    region: 'US',
    repeater_SSID: 'netis',
    channel_band: 0,
    channel_num: 0,
    waln_partition: 0,
    SSID_broadcast: 1,
    status_channel_num: 8,
    noise: 128,
    ap_id: 0,
    port_id: 'WIFI1'
}

var jobcount = 0

function postssid(ssid) {
    formdata.AP_SSID = ssid;
    console.log('POST SSID ' + ssid);
    request.post(
        posturl, {
            form: formdata
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            } else {
                console.log(error)
            }
        }
    );
}

function scheduleJob() {
    var j = schedule.scheduleJob('*/10 * * * *', function() {
        jobcount++
        console.log('Job Count:' + jobcount);
        postssid('UAY12-CODE'+ (1000+jobcount))
    });
}

function main() {
    scheduleJob()
}

main()
