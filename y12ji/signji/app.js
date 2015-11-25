"use strict"
var hckeyjson = require('./hc1501.key.json')
var hc1501conf = require('./hc1501.conf.json')
var math = require('mathjs')
var bip38 = require('bip38')
var bitcorelib = require('bitcore-lib')
var bitcoremnemonic = require('bitcore-mnemonic')
var request = require('request')
var HDPrivateKey = bitcorelib.HDPrivateKey
var async = require("async")
var argv = require('minimist')(process.argv.slice(2))

class JiApp {
    constructor(name) {

        this._name = name

        var pf = {
            raw: {
                key: hckeyjson,
                conf: hc1501conf
            },
            hckey: new HDPrivateKey(hckeyjson.hdkey)
        }

        pf.version = pf.raw.conf.ver1 + '.0.' + pf.raw.conf.ver2

        this._info = pf
    }

    reqJsonCallback(url, cb) {
        request({
            url: url,
            json: true
        }, function(error, response, result) {
            if (!error && response.statusCode == 200) {
                return cb(null, result);
            } else {
                return cb(error, null);
            }
        })
    }

    reqbc() {
        var self = this;
        async.series([
                function(callback) {
                    var opkey = self.buildopkey()
                    return callback(null, opkey)
                },
                function(callback) {
                    var url = 'https://api.bitcoinaverage.com/ticker/global/all'
                    self.reqJsonCallback(url, callback)
                },
                function(callback) {
                    var url = 'https://api.blockcypher.com/v1/btc/main'
                    self.reqJsonCallback(url, callback)
                },
                function(callback) {
                    // Blockchain Developer API for Bitcoin, Testnet, Litecoin and More | Blockcypher
                    // http://dev.blockcypher.com/?javascript#address-endpoint
                    // https://api.blockcypher.com/v1/btc/main/addrs/[ADDR]
                    var url = 'https://api.blockcypher.com/v1/btc/main/addrs/' + self._info.opkey.input.address
                    self.reqJsonCallback(url, callback)
                }
            ],
            // optional callback
            function(err, results) {
                if (err) {
                    console.log(err)
                } else {
                    // results is now equal to ['one', 'two']
                    // console.log(results)
                    var bavg = results[1]
                    self._info.extreq = {
                        btcavg: {
                            BTCUSD: bavg.USD.last,
                            BTCEUR: bavg.EUR.last,
                            BTCTWD: bavg.TWD.last,
                            BTCCNY: bavg.CNY.last,
                            USDTWD: math.round(bavg.TWD.last/bavg.USD.last,2)
                        },
                        bcnet: results[2],
                        bcinput: results[3]
                    }
                    console.log(self._info)
                }
            });
    }

    buildopkey() {
        // input m/[ver1]h/1/[ver2]-1
        // output m/[ver1]h/0/1 never change ?
        // change m/[ver1]h/1/[ver2]
        var account = this._info.raw.conf.ver1
        var id = this._info.raw.conf.ver2
        var opkey = {
            output: this.dkey(account, 0, 1),
            input: this.dkey(account, 1, id - 1),
            change: this.dkey(account, 1, id)
        }
        this._info.opkey = opkey
        return opkey
    }

    keytitle(account, channel, id) {
        return 'm/' + account + 'h/' + channel + "/" + id
    }

    dkey(account, channel, id) {
        var pkey = this._info.hckey
        var exkey = pkey.derive(account, true).derive(channel).derive(id)
        var key = exkey.privateKey
        return {
            title: this.keytitle(account, channel, id),
            account: account,
            channel: channel,
            id: id,
            raw: exkey,
            wif: key.toWIF(),
            address: key.toAddress().toString()
        }
    }

    listkey(account, channel, n) {
        var r = []
            // m/1h/0/1
            // ar derivedByNumber = hdPrivateKey.derive(1).derive(2, true);
        for (var i = 0; i < n; i++) {
            r.push(this.dkey(account, channel, i))
        }
        return r
    }

    get info() {
        return this._info
    }
    get name() {
        return this._name
    }
}

var jp = new JiApp('WoW')
    // bitcore-lib/hash.js at master · bitpay/bitcore-lib
    // https://github.com/bitpay/bitcore-lib/blob/master/lib/crypto/hash.js
    // file2buffer?

if (argv.buildopkey) {
    jp.buildopkey()
}

if (argv.reqbc) {
    jp.reqbc()
}

if (argv.info) {
    console.log(jp.info)
}

if (argv.key) {
    console.log(jp.dkey(argv.a || 0, argv.c || 0, argv.n || 1))
}

if (argv.listkey) {
    console.log(jp.listkey(argv.a || 0, argv.c || 0, argv.n || 2))
}
