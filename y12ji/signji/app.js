"use strict"
var fs = require('fs')
var hckeyjson = require('./hc1501.key.json')
var hc1501conf = require('./hc1501.conf.json')
var math = require('mathjs')
var bip38 = require('bip38')
var bitcorelib = require('bitcore-lib')
var bitcoremnemonic = require('bitcore-mnemonic')
var request = require('request')
var HDPrivateKey = bitcorelib.HDPrivateKey
var async = require("async")
var inline = require('web-resource-inliner')
var moment = require('moment');
var SHA256 = require("crypto-js/sha256");
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

        var pc = pf.raw.conf
        var ver = pc.ver1 + '.0.' + pc.ver2
        var tfile = pc.appname + '-' + ver + '.html'
        pf.release = {
            version: ver,
            path: pc.path,
            tag: pc.rplacetag,
            src: pc.path + pc.file,
            url: pc.path + tfile,
            file: tfile,
            time: moment().format()
        }
        this._info = pf
    }

    reqWebInline(cb) {
        var self = this;
        var info = self._info
        var ir = info.release
            // replaceTag = Y12JI_RELEASE_INFO_TAG
            // https://y12ji.com/p2015/hexcard/
        request(ir.src, function(error, response, result) {
            if (!error && response.statusCode == 200) {
                inline.html({
                    fileContent: result,
                    relativeTo: ir.path,
                    images: true
                }, function(error, htmlFinal) {
                    if (error) {
                        return cb(error, null)
                    }

                    var htmlResult = htmlFinal.replace(ir.tag, ir.tagresult)
                    var hash = SHA256(htmlResult).toString()
                    fs.writeFileSync(ir.file, htmlResult, 'utf8')
                    info.release.hash = hash
                    return cb(null, "ok")
                })
            }
        })
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

    serInline() {
        var self = this;
        var info = self._info;
        async.series([
            function(callback) {
                self.reqbc()
                return callback(null, "ok")
            },
            function(callback) {
                self.reqWebInline(callback)
            }
        ], function(err, results) {
            if (err) {
                console.log(err)
            } else {
                console.log(info)
            }
        })

    }

    reqbc() {
        var self = this;
        var info = self._info
        async.series([
                function(callback) {
                    var account = info.raw.conf.ver1
                    var id = info.raw.conf.ver2
                    info.opkey = self.buildopkey(account, id)
                    return callback(null, "ok")
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
                    var url = 'https://api.blockcypher.com/v1/btc/main/addrs/' + info.opkey.input.address
                    self.reqJsonCallback(url, callback)
                }
            ],
            // optional callback
            function(err, results) {
                if (err) {
                    console.log(err)
                } else {
                    info.extreq = {
                        btcavg: self.convertBtcavg(results[1]),
                        bcnet: results[2],
                        bcinput: results[3]
                    }
                    info.release.tagresult = self.buildReleaseInfo(info)
                    console.log(info)
                }
            })
    }

    buildReleaseInfo(info) {
        var rel = info.release
        var opkey = info.opkey
        var bcnet = info.extreq.bcnet
        var btcavg = info.extreq.btcavg
        return ["VERSION=" + rel.version,
            "TIME=" + rel.time,
            "URL=" + rel.url,
            "ADDRESS_FROM=" + opkey.input.address,
            "ADDRESS_TO=" + opkey.output.address,
            "BITCOIN_BLOCK=" + bcnet.height,
            "BTCTWD=" + btcavg.BTCTWD,
            "BTCUSD=" + btcavg.BTCUSD
        ].join(' , ')
    }

    convertBtcavg(bavg) {
        return {
            BTCUSD: bavg.USD.last,
            BTCEUR: bavg.EUR.last,
            BTCTWD: bavg.TWD.last,
            BTCCNY: bavg.CNY.last,
            USDTWD: math.round(bavg.TWD.last / bavg.USD.last, 2)
        }
    }

    buildopkey(account, id) {
        // input m/[ver1]h/1/[ver2]-1
        // output m/[ver1]h/1/[ver2]
        // change none
        //var account = this._info.raw.conf.ver1
        //var id = this._info.raw.conf.ver2
        var opkey = {
            output: this.dkey(account, 0, 1),
            input: this.dkey(account, 1, id - 1)
            //change: this.dkey(account, 1, id)
        }
        //this._info.opkey = opkey
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

if (argv.buildopkey) {
    jp.buildopkey()
    console.log(jp.info)
}

if (argv.reqbc) {
    jp.reqbc()
}

if (argv.serinline) {
    jp.serInline()
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
