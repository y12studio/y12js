var _ = require('lodash')
var request = require('request')
var moment = require('moment')
var bitcorelib = require('bitcore-lib')
var Mnemonic = require('bitcore-mnemonic')
var generator = require('generate-password')
var ZH_TW_WORDLIST = require('./chinese_traditional.json')
Mnemonic.Words.CHINESE_TRADITIONAL = ZH_TW_WORDLIST
var Networks = bitcorelib.Networks

var bookId = {}

bookId.password = generator.generate({
    length: 42,
    numbers: true
});

bookId.seed = bookId.password

var date = moment().format('YYYY-MM-DD')
console.log(date)

function getCode(seedStr, wordsize, _opt) {
    // 12,15,18,21,24=128~256
    var wsize = wordsize || 12
    var opt = _opt || {}
    var network = opt.network || Networks.testnet
    var wordlist = Mnemonic.Words.CHINESE_TRADITIONAL
    var buf = new bitcorelib.deps.Buffer(seedStr)
    var buf256 = bitcorelib.crypto.Hash.sha256(buf)
    var entSize = wsize * 4 / 3
    var bufEnt = buf256.slice(0, entSize)
    var code = new Mnemonic(bufEnt, wordlist)
    var xpriv = code.toHDPrivateKey(opt.password, network)
    return {
        opt: opt,
        xpriv: xpriv,
        seed: seedStr,
        code: code.toString()
    }
}


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
        } else {
            cb(error)
        }
    })
}


function getDeriveKeys(mcode, account, channel, kid, _opt) {
    var opt = _opt || {}
    var network = opt.network || Networks.testnet
    var wordlist = Mnemonic.Words.CHINESE_TRADITIONAL
    var code = new Mnemonic(mcode, wordlist)
    var xpriv = code.toHDPrivateKey(opt.password, network)
    var exkey = xpriv.derive(account, true).derive(channel).derive(kid)
    var key = exkey.privateKey
    return {
        xpriv: xpriv,
        mcode: mcode,
        account: account,
        channel: channel,
        kid: kid,
        key: key,
        ktitle: 'm/' + account + 'h/' + channel + "/" + kid,
        address: key.toAddress().toString(),
        wif: key.toWIF()
    }
}


function createKeys() {

    var password = generator.generate({
            length: 42,
            numbers: true
        })

        var seed1 = password + generator.generate({
            length: 24,
            numbers: true
        })

        var seed2 = password + generator.generate({
            length: 24,
            numbers: true
        })

        var optMain = {
            network: Networks.mainnet,
            password: password
        }

        var r1code = getCode(seed1, 24, optMain)
        var r2code = getCode(seed2, 18, optMain)

        return {
            password: password,
            code: (r1code.code + r2code.code).replace(/\s+/g, '')
        }
    }

    function main() {
        getPrice(function(err, res) {
            var keys = createKeys()
            console.log(res)
            keys.time = res.raw.time.updatedISO
            var btcUsd = res.btcusd
            var btcTwd = res.btctwd
            var usdTwd = res.usdtwd
            keys.btcinfo = keys.time+ ',BTCUSD=' + btcUsd + ',BTCTWD=' + btcTwd + ',USDTWD=' + usdTwd
            console.log(keys)
        })
    }

    main()
