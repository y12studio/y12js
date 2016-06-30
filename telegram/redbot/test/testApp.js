var utils = require('../utils')
var emoji = require('node-emoji');
var bitcorelib = require('bitcore-lib')
var assert = require('chai').assert

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('RedBot', function() {
    it('fooTest', function() {

        utils.updateBitoex({
            sell: 10000,
            buy: 11000
        })
        utils.updateMaicoin({
            sell_price: "8000.00",
            buy_price: "10000.00"
        })
        var r = utils.btctwd
        var b = r.bitoex
        var m = r.maicoin
        assert.equal(10500, b.avg)
        assert.equal(9000, m.avg)
        assert.equal(9750, r.avg)
        var x = utils.toTwd(1.0)
        console.log(x)
        console.log(utils.toTwd(0.5))
    })
    it('argsTest', function() {
        var r = utils.parseCmd('/y12 btctwd 0.1234')
        console.log(r)
        assert.equal('btctwd', r.cmd)
        assert.equal(0.1234, r.btc)
        console.log(utils.toTwd(r.btc))
        var r = utils.parseCmd('/y12')
        console.log(r)
        assert.equal('btctwd', r.cmd)

        var tbtc = utils.parseCmd('/y12 tbtc')
        console.log(tbtc)
        assert.equal('tbtc', tbtc.cmd)
        assert.equal(1, tbtc.kid)
        assert.equal(2,  utils.parseCmd('/y12 tbtc 2').kid)
        assert.equal(1,  utils.parseCmd('/y12 tbtc 0.123').kid)
        assert.equal(1,  utils.parseCmd('/y12 tbtc -1000').kid)
        console.log(utils.handleCmd('/y12 btctwd 0.22222'))

        var pchat = utils.handleCmd('/y12 tbtc 1', {username:'y12', token:'haha', chattype:'private'})
        console.log(pchat)
        assert.isTrue(pchat.indexOf('KEY')>0)
        var gchat = utils.handleCmd('/y12 tbtc 1', {username:'y12', token:'haha', chattype:'group'})
        console.log(gchat)
        assert.isTrue(gchat.indexOf('KEY')<0)

    })
    it('bitcoinHdKeyTests', function() {
        var hdkey = utils.getHDPrivateKey('Hello TestBot')
        console.log(hdkey.toJSON())
        assert.equal('testnet', hdkey.network)
        var hdkey2 = utils.getHDPrivateKey('Hello TestBot')
        console.log(hdkey2)
        assert.equal(hdkey.toString(), hdkey2.toString())
        var hdkey3 = utils.getHDPrivateKey('Hello TestBot3', {
            network: bitcorelib.Networks.livenet
        })
        console.log(hdkey3.toJSON())
        assert.equal('livenet', hdkey3.network)

        var dpk = utils.getDeriveKey(hdkey, 1)
        console.log(dpk.toJSON())
        var pk = dpk.privateKey
        assert.equal('tprv8gx25CZwYW93N5WqBqBtmtm5mchMHZhseePqZvc4jRZive54jtZEHxJ1CNTf26tQJtr4p6qfT88JHYSv4sEihWD9iTKPXNir1aGr6fbNnEF', dpk.xprivkey)
        var addr = pk.toAddress().toString()
        assert.equal('mhbb8V6ptAutyd2mwEnRDDPJ3cDYQgaSCu', addr)
    })


})
