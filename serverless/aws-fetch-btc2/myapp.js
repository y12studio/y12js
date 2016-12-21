const fetch = require('node-fetch')
const shuffle = require('shuffle-array')
const url = 'https://api.coindesk.com/v1/bpi/currentprice/TWD.json'

function MyApp() {}

MyApp.prototype.hello = function() {
    return 'hello world'
}

MyApp.formatTwd = function(json) {
    console.log(json)
    var bpi = json.bpi
    var btcusd = bpi.USD.rate_float
    var btctwd = bpi.TWD.rate_float
    var usdtwd = btctwd / btcusd
    return {
        raw: json,
        btcusd: Math.round(btcusd),
        btctwd: Math.round(btctwd),
        usdtwd: Math.round(usdtwd * 100) / 100,
        time: new Date().toTimeString()
    }
}

MyApp.prototype.buildResponse = function() {
    return fetch(url).then(function(res) {
        return res.json()
    }).then(function(json) {
        var body = MyApp.formatTwd(json)
        const response = {
            statusCode: 200,
            body: JSON.stringify(body)
        }
        return response
    })
}

module.exports = MyApp
