const util = require('util')
const emoji = require('node-emoji')
const minimist = require('minimist')
var _ = require('lodash');

module.exports = {

    parseCmd: function parseCmd(args) {
        var r = minimist(args.split(' '))
        return {
            cmd: r._.length >= 2 ? r._[1] : 'btctwd',
            btc: r._.length >= 3 ? r._[2] : 1.0,
        }
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
