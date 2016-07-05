const util = require('util')
var Promise = require('bluebird')
const emoji = require('node-emoji')
const minimist = require('minimist')
var _ = require('lodash');
var bitcorelib = require('bitcore-lib')
var explorers = require('bitcore-explorers')
var HDPrivateKey = bitcorelib.HDPrivateKey;
var insight = new explorers.Insight(bitcorelib.Networks.testnet);
var UnspentOutput = bitcorelib.Transaction.UnspentOutput;
var Unit = bitcorelib.Unit;

function Yoo() {}

Yoo.prototype.createTxAsyc = function(foo){
    return new Promise(function(resolve, reject){
        // Get Account details
        var sample_return = {
            "accounts": [
                {
                    "account_id": 1725389
                }
            ],
        };
        var accounts = sample_return["accounts"];
        if (accounts.length > 0) {
            resolve(accounts);
        } else {
            reject('No Accounts');
        }
    });
}

Yoo.prototype.createTx = function(utxos, addrTo, addrChange, amountTo, privateKey) {
    var amountFee = 0.001
    var amountSrc = _.reduce(utxos, function(sum, element) {
        return sum + element.amount;
    }, 0)

    var satoshisSrc =  Unit.fromBTC(amountSrc).toSatoshis()
    var satoshisTo = Unit.fromBTC(amountTo).toSatoshis()
    var satoshisFee =  Unit.fromBTC(amountFee).toSatoshis()

    return new bitcorelib.Transaction()
        .fee(satoshisFee)
        .from(utxos)
        .to(addrTo, satoshisTo)
        .change(addrChange)
        .sign(privateKey)
}

Yoo.prototype.sendto = function(tx, cb) {
    insight.broadcast(tx, cb)
}

Yoo.prototype.getUtxos = function(addr, confirmations, cb) {
    insight.getRawUnspentUtxos(addr, function(err, utxos) {
        if (err) {
            cb(err)
        } else {
            // mapping element >= confirmations
            var fUtxos = _.filter(utxos, _.conforms({
                'confirmations': function(n) {
                    return n >= confirmations;
                }
            }))
            cb(null, {
                raw: utxos,
                confirmations: confirmations,
                cfamount: _.reduce(fUtxos, function(sum, element) {
                    return sum + element.amount;
                }, 0),
                cfutxos: _.map(fUtxos, UnspentOutput)
            })
        }
    })
}

Yoo.prototype.getAccountKeyInfo = function(accountId, _opt) {
    var opt = _opt || {}
    var username = opt.username || 'y12'
    var token = opt.token || 'token'
    var hkey = this.getHDPrivateKey(username + 'haha:)' + token)
    var dkey = this.getDeriveKey(hkey, accountId)
    var pk = dkey.privateKey
    var addr = pk.toAddress().toString()
    return {
        username: username,
        pk: pk,
        addr: pk.toAddress().toString(),
        hkey: hkey,
        account: accountId,
        dkey: dkey
    }
}

Yoo.prototype.handleCmd = function(messageTxt, _opt, cb) {
    var opt = _opt || {}
    var r = this.parseCmd(messageTxt)
    var result = "Hello"
    var chattype = opt.chattype || 'group'
    var username = opt.username || 'y12'
    switch (r.cmd) {
        case "btctwd":
            cb(null, this.toTwd(r.btc))
            break;
        case "tbtc":
            var accountKeyInfo = this.getAccountKeyInfo(r.kid, _opt)
            result = this.toTbtcUser(accountKeyInfo, chattype)
            cb(null, result)
            break;
        case "tbutxo":
            var accountKeyInfo = this.getAccountKeyInfo(r.kid, _opt)
            this.toTbutxo(accountKeyInfo, chattype, cb)
            break;
        case "help":
            cb(null, this.toHelp(username))
            break;
    }
}

Yoo.prototype.getHDPrivateKey = function(seedStr, _opt) {
    var opt = _opt || {}
    var network = opt.network || bitcorelib.Networks.testnet
    var buf = new bitcorelib.deps.Buffer(seedStr)
    var buf256 = bitcorelib.crypto.Hash.sha256sha256(buf)
    return new HDPrivateKey.fromSeed(buf256, network)
}

Yoo.prototype.getDeriveKey = function(hdkey, id) {
    return hdkey.derive("m/0'/0").derive(id)
}

Yoo.prototype.parseCmd = function(args) {
    var r = minimist(args.split(' '))
    var ra = r._
    var result = {
        cmd: ra.length >= 2 ? ra[1] : 'btctwd'
    }
    switch (result.cmd) {
        case "btctwd":
            result.btc = ra.length >= 3 ? ra[2] : 1.0
            break;
        case "tbtc":
            result.kid = ra.length >= 3 && _.isInteger(ra[2]) ? ra[2] : 1
            break;
        case "tbutxo":
            result.kid = ra.length >= 3 && _.isInteger(ra[2]) ? ra[2] : 1
            break;
    }
    return result
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

Yoo.prototype._calcTwd = function(btc) {
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

Yoo.prototype.toTbtcUser = function(accountKeyInfo, chattype) {
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

Yoo.prototype.toHelp = function(username) {
    return util.format('%s你好，使用方式: %s %s 水龍頭: %s',
        username, 'https://github.com/y12studio/y12js/tree/master/telegram/redbot', Yoo.ranemoji(), 'https://testnet.manu.backend.hamburg/faucet')
}

Yoo.prototype.toTbutxo = function(accKeyInfo, chattype, cb) {
    var emoji1 = emoji.get('money_with_wings')
    var username = accKeyInfo.username
    var addr = accKeyInfo.addr
    this.getUtxos(addr, 1, function(err, res) {
        // console.log(JSON.stringify(res,null, 2))
        var str = util.format('%s %s %s %s amount=%s %s utxos=%s %s https://live.blockcypher.com/btc-testnet/address/%s',
            username, emoji1, addr, Yoo.ranemoji(), res.cfamount, Yoo.ranemoji(), res.cfutxos.length, Yoo.ranemoji(), addr)
        cb(null, str)
    })
}

Yoo.prototype.toTwd = function(btc) {
    var r = this._calcTwd(btc)
    var emoji1 = emoji.get('money_with_wings')
        // 計算方式參閱 https://github.com/y12studio/y12js/tree/master/telegram/redbot
    var note = "注意：價格非即時僅供參考，不宜做為買賣依據或諮詢之用。"
    return util.format('%s BTC = %s TWD %s bitoex 買%s賣%s平%s %s maicoin 買%s賣%s平%s %s %s', btc, r.avg, emoji1, r.b.buy, r.b.sell, r.b.avg,
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
