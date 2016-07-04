const util = require('util')
const emoji = require('node-emoji')
const minimist = require('minimist')
var _ = require('lodash');
var bitcorelib = require('bitcore-lib')
var explorers = require('bitcore-explorers')
var HDPrivateKey = bitcorelib.HDPrivateKey;
var insight = new explorers.Insight(bitcorelib.Networks.testnet);
var UnspentOutput = bitcorelib.Transaction.UnspentOutput;

module.exports = {

    getUtxos: function getUtxos(addr, confirmations, cb) {
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
                    cfamount: _.reduce(fUtxos, function(sum, element) {
                        return sum + element.amount;
                    }, 0),
                    cfutxos: _.map(fUtxos, UnspentOutput)
                })
            }
        });

    },

    handleCmd: function handleCmd(messageTxt, _opt) {
        var opt = _opt || {}
        var r = this.parseCmd(messageTxt)
        var result = "Hello"
        switch (r.cmd) {
            case "btctwd":
                result = this.toTwd(r.btc)
                break;
            case "tbtc":
                var username = opt.username || 'y12'
                var token = opt.token || 'token'
                var chattype = opt.chattype || 'group'
                var hkey = this.getHDPrivateKey(username + 'haha:)' + token)
                var dkey = this.getDeriveKey(hkey, r.kid)
                var pk = dkey.privateKey
                result = this.toTbtcUser(username, pk, chattype)
                break;
            default:
                console.log("Sorry, we are out of " + expr + ".");
        }
        return result
    },

    getHDPrivateKey: function getHDPrivateKey(seedStr, _opt) {
        var opt = _opt || {}
        var network = opt.network || bitcorelib.Networks.testnet
        var buf = new bitcorelib.deps.Buffer(seedStr)
        var buf256 = bitcorelib.crypto.Hash.sha256sha256(buf)
        return new HDPrivateKey.fromSeed(buf256, network)
    },

    getDeriveKey: function getDeriveKey(hdkey, id) {
        return hdkey.derive("m/0'/0").derive(id)
    },

    parseCmd: function parseCmd(args) {
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
            default:
                console.log("Sorry, we are out of " + expr + ".");
        }
        return result
    },

    updateMaicoin: function(r) {
        this.btctwd.maicoin.buy = Math.round(parseFloat(r.buy_price))
        this.btctwd.maicoin.sell = Math.round(parseFloat(r.sell_price))
        this._postFormat()
    },

    updateBitoex: function(r) {
        this.btctwd.bitoex.buy = r.buy
        this.btctwd.bitoex.sell = r.sell
        this._postFormat()
    },

    _calcTwd: function calcTwd(btc) {
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
    },

    toTbtcUser: function toTbtcUser(username, pk, chattype) {
        var emoji1 = emoji.get('money_with_wings')
        var emoji2 = emoji.get(_.sample(this.emojiarr))
        var emoji3 = emoji.get(_.sample(this.emojiarr))
        var addr = pk.toAddress().toString()
        var note = "注意：比特幣測試幣只供測試之用。"
        if (chattype == 'private') {
            return util.format('%s %s KEY %s %s %s %s https://live.blockcypher.com/btc-testnet/address/%s %s %s', username, emoji1, pk.toWIF(), emoji1, addr, emoji2, addr, emoji3, note)
        } else {
            return util.format('%s %s %s %s https://live.blockcypher.com/btc-testnet/address/%s %s %s', username, emoji1, addr, emoji2, addr, emoji3, note)
        }
    },

    toTwd: function toTwd(btc) {
        var r = this._calcTwd(btc)
        var emoji1 = emoji.get('money_with_wings')
        var emoji2 = emoji.get(_.sample(this.emojiarr))
        var emoji3 = emoji.get(_.sample(this.emojiarr))
            // 計算方式參閱 https://github.com/y12studio/y12js/tree/master/telegram/redbot
        var note = "注意：價格非即時僅供參考，不宜做為買賣依據或諮詢之用。"
        return util.format('%s BTC = %s TWD %s bitoex 買%s賣%s平%s %s maicoin 買%s賣%s平%s %s %s', btc, r.avg, emoji1, r.b.buy, r.b.sell, r.b.avg,
            emoji2, r.m.buy, r.m.sell, r.m.avg, emoji3, note)
    },

    _postFormat: function postFormat() {
        var v = this.btctwd
        var b = v.bitoex
        var m = v.maicoin
        b.avg = Math.round((b.buy + b.sell) / 2)
        m.avg = Math.round((m.buy + m.sell) / 2)
        v.avg = Math.round((b.avg + m.avg) / 2)
        return v
    },

    emojiarr: ['heart', 'anchor', 'airplane', 'snowflake', 'relaxed', 'snowman', 'v', 'star', 'u7a7a', 'u6e80', 'rocket', 'coffee', 'shamrock'],

    btctwd: {
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
}
