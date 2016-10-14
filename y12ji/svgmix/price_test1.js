var request = require('request');

function getPrice(cb) {
    var url = 'https://api.coindesk.com/v1/bpi/currentprice/TWD.json'
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body)
            var bpi = body.bpi
            var btcusd = bpi.USD.rate_float
            var btctwd = bpi.TWD.rate_float
            var usdtwd = btctwd / btcusd
                // float_num.toFixed(2);
            var r = {
                raw: body,
                btcusd: Math.round(btcusd),
                btctwd: Math.round(btctwd),
                usdtwd: Math.round(usdtwd * 100) / 100
            }
            cb(null, r)
        }else{
            cb(error)
        }
    })
}

getPrice(function(err,res){
    if(res){
        console.log(res)
    }
})
