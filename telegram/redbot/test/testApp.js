var utils = require('../utils')
var emoji = require('node-emoji');
var assert = require('chai').assert

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('RedBot', function() {
    it('fooTest', function() {

        utils.updateBitoex({sell:10000,buy:11000})
        utils.updateMaicoin({sell_price:"8000.00",buy_price:"10000.00"})
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

    })

})
