const util = require('util')
var spf = require("sprintf-js").sprintf
var Promise = require('bluebird')
const emoji = require('node-emoji')
const minimist = require('minimist')
var _ = require('lodash')
var bitcorelib = require('bitcore-lib')
var explorers = require('bitcore-explorers')
var HDPrivateKey = bitcorelib.HDPrivateKey
var insight = new explorers.Insight(bitcorelib.Networks.testnet)
var UnspentOutput = bitcorelib.Transaction.UnspentOutput
var Unit = bitcorelib.Unit
var errors = require('./errors')

function Yoo() {}

Yoo.errors = errors
Yoo.prototype.fooPromise = function(intValue, strValue) {
    return new Promise(function(resolve, reject) {
        console.log(intValue, strValue)
        if (strValue == 'testFooErr') {
            if (intValue >= 180) {
                reject(new errors.Foo.UnknownCode(spf('expected less than %d but got %d', 180, intValue)))
            } else {
                resolve(9991)
            }
        }
        var result = 100 + intValue
        if (result > 1000) {
            resolve(result);
        } else {
            reject(new Error('Result Error'));
        }
    });
}

Yoo.BTC = {
    fee: 0.001
}
Yoo.BTC.feeSatoshis = Unit.fromBTC(Yoo.BTC.fee).toSatoshis()

Yoo.check = function(condition, errType, message) {
    if (!condition) {
        throw new errType(message);
    }
}

Yoo.createSignTx = function(utxos, addrTo, addrChange, amountTo, privateKey) {
    return new Promise(function(resolve, reject) {

        var satoshisSrc = _.reduce(utxos, function(sum, e) {
                return sum + e.satoshis;
            }, 0)
            //console.log(spf('Amount=%d, Fee=%d', satoshisSrc, Yoo.BTC.feeSatoshis))
        Yoo.check(satoshisSrc > Yoo.BTC.feeSatoshis, errors.Tx.Amount, spf('Expect Amount %d > Fee %d', satoshisSrc, Yoo.BTC.feeSatoshis))
        var satoshisOut = Unit.fromBTC(amountTo).toSatoshis()
        Yoo.check(satoshisSrc + Yoo.BTC.feeSatoshis >= satoshisOut, errors.Tx.Amount, spf('Expect AmountIn %d + Fee %d >= AmountOut %d',
            satoshisSrc, Yoo.BTC.feeSatoshis, satoshisOut))

        var tx = new bitcorelib.Transaction()
            .fee(Yoo.BTC.feeSatoshis)
            .from(utxos)
            .to(addrTo, satoshisOut)
            .change(addrChange)
            .sign(privateKey)
        resolve(tx)
    });
}

Yoo.prototype.sendto = function(tx, cb) {
    insight.broadcast(tx, cb)
}

Yoo.getUtxos = function(addr, confirmations) {
    return new Promise(function(resolve, reject) {
        insight.getRawUnspentUtxos(addr, function(err, utxos) {
            if (err) {
                reject(err)
            } else {
                // mapping element >= confirmations
                var fUtxos = _.filter(utxos, _.conforms({
                    'confirmations': function(n) {
                        return n >= confirmations;
                    }
                }))
                resolve({
                    raw: utxos,
                    confirmations: confirmations,
                    cfamount: _.reduce(fUtxos, function(sum, element) {
                        return sum + element.amount;
                    }, 0),
                    cfutxos: _.map(fUtxos, UnspentOutput)
                })
            }
        })
    })

}

Yoo.getAccountKeyInfo = function(accountId, _opt) {
    var opt = _opt || {}
    var username = opt.username || 'y12'
    var token = opt.token || 'token'
    var seedStr = username.toUpperCase() + 'haha:)' + token
    var hkey = Yoo.getHDPrivateKey(seedStr)
    var dkey = Yoo.getDeriveKey(hkey, accountId)
    var pk = dkey.privateKey
    var addr = pk.toAddress().toString()
    return {
        seed: seedStr,
        username: username,
        pk: pk,
        addr: pk.toAddress().toString(),
        hkey: hkey,
        account: accountId,
        dkey: dkey
    }
}

Yoo.handleCmd = function(yobj, messageTxt, _opt) {
    return new Promise(function(resolve, reject) {
        var opt = _opt || {}
        var pr = Yoo.parseCmd(messageTxt)
        var result = "Hello"
        var chattype = opt.chattype || 'group'
        var username = opt.username || 'y12'
        switch (pr.cmd) {
            case "btctwd":
                resolve(Yoo.toTwd(yobj.calcTwd(pr.btc)))
                break;
            case "tbtc":
                var accountKeyInfo = Yoo.getAccountKeyInfo(pr.kid, _opt)
                result = Yoo.toTbtcUser(accountKeyInfo, chattype)
                resolve(result)
                break;
            case "tbutxo":
                var accKeyInfo = Yoo.getAccountKeyInfo(pr.kid, _opt)
                var addr = accKeyInfo.addr
                var confirmations = 1
                Yoo.getUtxos(addr, confirmations).then(function(res) {
                    resolve(Yoo.toTbutxo(accKeyInfo, chattype, res))
                })
                break;
            case "tbsend":
                if (pr.result) {

                } else {
                    reject(new errors.InvalidArgument('tbsend', messageTxt))
                }
                break;
            case "help":
                resolve(Yoo.toHelp(username))
                break;
        }
    })
}

Yoo.checkPayerParam = function(str) {
    var r = {
        result: false
    }

    if (_.includes(str, '/')) {
        var sarr = str.split('/')
        if (sarr[0].length == 0 || sarr[1].length == 0) {
            return r
        }
        var amount = _.toNumber(sarr[0])
        var payerAid = _.toNumber(sarr[1])
            //console.log(sarr, sarr.length, amount, payerAid)
        if (sarr.length == 2 && _.isFinite(amount) && amount > 0 && _.isInteger(payerAid) && payerAid > 0) {
            r.result = true
            r.amount = amount
            r.payerAid = payerAid
        }
    } else {
        var amount = _.toNumber(str)
        if (_.isFinite(amount) && _.isInteger(amount) && amount > 0) {
            r.result = true
            r.amount = amount
            r.payerAid = 1
        }
    }
    console.log(r, str)
    return r
}

Yoo.checkPayeeParam = function(str) {
    var r = {
        result: false
    }
    if (!_.startsWith(str, '@')) {
        return r
    }

    if (_.includes(str, '/')) {
        var sarr = str.split('/')
        if (sarr[0].length == 0 || sarr[1].length == 0) {
            return r
        }
        var payee = sarr[0].replace('@', '')
        var payeeAid = _.toNumber(sarr[1])
        if (sarr.length == 2 && _.isInteger(payeeAid)) {
            r.result = true
            r.payee = payee
            r.payeeAid = payeeAid
        }
    } else {
        r.result = true
        r.payee = str.replace('@', '')
        r.payeeAid = 1
    }
    return r
}

Yoo.getHDPrivateKey = function(seedStr, _opt) {
    var opt = _opt || {}
    var network = opt.network || bitcorelib.Networks.testnet
    var buf = new bitcorelib.deps.Buffer(seedStr)
    var buf256 = bitcorelib.crypto.Hash.sha256sha256(buf)
    return new HDPrivateKey.fromSeed(buf256, network)
}

Yoo.getDeriveKey = function(hdkey, id) {
    return hdkey.derive("m/0'/0").derive(id)
}

Yoo.checkAccountId = function(str) {
    var aid = _.toNumber(str)
    return {
        aid: aid,
        result: _.isFinite(aid) && _.isInteger(aid) && aid > 0
    }
}

Yoo.parseCmd = function(args) {
    var ra = args.split(' ')
    var len = ra.length
    var pr = {
        result: false,
        cmd: len >= 2 ? ra[1] : 'btctwd'
    }
    switch (pr.cmd) {
        case "btctwd":
            if (len == 2) {
                pr.btc = 1.0
                pr.result = true
            } else if (len == 3) {
                var btc = _.toNumber(ra[2])
                if (_.isFinite(btc) && btc > 0) {
                    pr.result = true
                    pr.btc = btc
                }
            }
            break
        case "tbtc":
            if (len == 2) {
                pr.kid = 1
                pr.result = true
            } else if (len == 3) {
                var cr = Yoo.checkAccountId(ra[2])
                pr.kid = cr.aid
                pr.result = cr.result
            }
            break
        case "tbutxo":
            // console.log(ra)
            if (len == 2) {
                pr.kid = 1
                pr.result = true
            } else if (len == 3) {
                var cr = Yoo.checkAccountId(ra[2])
                pr.kid = cr.aid
                pr.result = cr.result
            }
            break
        case "tbsend":
            var payerParam = Yoo.checkPayerParam(ra[2])
            var payeeParam = Yoo.checkPayeeParam(ra[3])
            if (len == 4 && payerParam.result && payeeParam.result) {
                pr.amount = payerParam.amount
                pr.payerAid = payerParam.payerAid
                pr.payee = payeeParam.payee
                pr.payeeAid = payeeParam.payeeAid
                pr.result = true
            }
            break
    }
    console.log(pr, args)
    return pr
}


Yoo.prototype.updateMaicoin = function(r) {
    this.btctwd.maicoin.buy = Math.round(parseFloat(r.buy_price))
    this.btctwd.maicoin.sell = Math.round(parseFloat(r.sell_price))
    this._postFormat()
}

Yoo.prototype.updateBitoex = function(r) {
    this.btctwd.bitoex.buy = r.buy
    this.btctwd.bitoex.sell = r.sell
    this._postFormat()
}

Yoo.prototype.calcTwd = function(btc) {
    var v = this.btctwd
    var b = v.bitoex
    var m = v.maicoin

    var multiplyRound = function(v1, v2) {
        if (_.isNumber(v1) && _.isNumber(v2)) {
            return Math.round(v1 * v2)
        } else {
            return 0
        }
    }
    var r = {
        avg: Math.round(v.avg * btc),
        btc: btc,
        m: _.mapValues(m, function(v) {
            return multiplyRound(v, btc)
        }),
        b: _.mapValues(b, function(v) {
            return multiplyRound(v, btc)
        })
    }
    return r
}

Yoo.ranemoji = function() {
    return emoji.get(_.sample(Yoo.emojiarr))
}

Yoo.toTbtcUser = function(accountKeyInfo, chattype) {
    var emoji1 = emoji.get('money_with_wings')
    var username = accountKeyInfo.username
    var pk = accountKeyInfo.pk
    var addr = accountKeyInfo.addr
    var wif = accountKeyInfo.pk.toWIF()
    var note = "注意：比特幣測試幣只供測試之用。"
    if (chattype == 'private') {
        return util.format('%s %s KEY %s %s %s %s https://live.blockcypher.com/btc-testnet/address/%s %s %s',
            username, emoji1, wif, emoji1, addr, Yoo.ranemoji(), addr, Yoo.ranemoji(), note)
    } else {
        return util.format('%s %s %s %s https://live.blockcypher.com/btc-testnet/address/%s %s %s',
            username, emoji1, addr, Yoo.ranemoji(), addr, Yoo.ranemoji(), note)
    }
}

Yoo.toHelp = function(username) {
    return util.format('%s你好，使用方式: %s %s 水龍頭: %s',
        username, 'https://github.com/y12studio/y12js/tree/master/telegram/redbot', Yoo.ranemoji(), 'https://testnet.manu.backend.hamburg/faucet')
}

Yoo.toTbutxo = function(accKeyInfo, chattype, res) {
    var emoji1 = emoji.get('money_with_wings')
    var username = accKeyInfo.username
    var addr = accKeyInfo.addr
    return util.format('%s %s %s %s amount=%s %s utxos=%s %s https://live.blockcypher.com/btc-testnet/address/%s',
        username, emoji1, addr, Yoo.ranemoji(), res.cfamount, Yoo.ranemoji(), res.cfutxos.length, Yoo.ranemoji(), addr)
}

Yoo.toTwd = function(r) {
    // var r = this._calcTwd(btc)
    var emoji1 = emoji.get('money_with_wings')
        // 計算方式參閱 https://github.com/y12studio/y12js/tree/master/telegram/redbot
    var note = "注意：價格非即時僅供參考，不宜做為買賣依據或諮詢之用。"
    return util.format('%s BTC = %s TWD %s bitoex 買%s賣%s平%s %s maicoin 買%s賣%s平%s %s %s', r.btc, r.avg, emoji1, r.b.buy, r.b.sell, r.b.avg,
        Yoo.ranemoji(), r.m.buy, r.m.sell, r.m.avg, Yoo.ranemoji(), note)
}

Yoo.prototype._postFormat = function() {
    var v = this.btctwd
    var b = v.bitoex
    var m = v.maicoin
    b.avg = Math.round((b.buy + b.sell) / 2)
    m.avg = Math.round((m.buy + m.sell) / 2)
    v.avg = Math.round((b.avg + m.avg) / 2)
    return v
}

Yoo.emojiarr = ['heart', 'anchor', 'airplane', 'snowflake', 'relaxed', 'snowman', 'v', 'star', 'u7a7a', 'u6e80', 'rocket', 'coffee', 'shamrock']

Yoo.prototype.btctwd = {
    avg: 0,
    bitoex: {
        sell: 0,
        buy: 0,
        avg: 0
    },
    maicoin: {
        sell: 0,
        buy: 0,
        avg: 0
    }
}

module.exports = Yoo
