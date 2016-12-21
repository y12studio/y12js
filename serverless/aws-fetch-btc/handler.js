'use strict';
const fetch = require('node-fetch')
const shuffle = require('shuffle-array')
const collection = [1, 2, 3, 4, 5]
const url = 'https://api.coindesk.com/v1/bpi/currentprice/TWD.json'

module.exports.hello = (event, context, callback) => {
    const ct = new Date().toTimeString()
    const arr2 = shuffle.pick(collection, {
        'picks': 2
    })
    fetch(url).then(function(res) {
        return res.json()
    }).then(function(json) {
        console.log(json)
        var bpi = json.bpi
        var btcusd = bpi.USD.rate_float
        var btctwd = bpi.TWD.rate_float
        var usdtwd = btctwd / btcusd
        var body = {
            raw: json,
            btcusd: Math.round(btcusd),
            btctwd: Math.round(btctwd),
            usdtwd: Math.round(usdtwd * 100) / 100,
            msg: `Go Serverless v1.0! The current time is ${ct}, shuffle.pick=${arr2.join()}.`
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify(body)
        }
        console.log(response)
        callback(null, response);
    })

};
