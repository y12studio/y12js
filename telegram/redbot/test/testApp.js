var bitcorelib = require('bitcore-lib')
var UnspentOutput = bitcorelib.Transaction.UnspentOutput
var _ = require('lodash')
var Yoo = require('../lib/yoo')
var errors = Yoo.errors
var yoo = new Yoo()
var chai = require('chai')
var assert = chai.assert
var expect = chai.expect
chai.should()
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

function treject(promise, errType) {
    promise.catch(errType, function(err) {
        console.log(err.message)
    })
    return promise.should.be.rejectedWith(errType)
}

describe('FooPromise', function() {

    it("fooPromiseIntResultErrorTest", function() {
        return yoo.fooPromise(200, 'xxxx').should.be.rejectedWith('Result Error')
    })

    it('RejectedWith BazErr', function() {
        var p = yoo.fooPromise(1999, 'testBazErr')
        return treject(p, errors.Baz)
    })
    it('RejectedWith FooErr', function() {
        var p = yoo.fooPromise(1999, 'testFooErr')
            // return expect(p).to.be.rejectedWith(errors.Foo.UnknownCode)
            // assert.isRejected(p, errors.Foo.UnknownCode)
            // return p.should.be.rejectedWith(errors.Foo.UnknownCode)
        return treject(p, errors.Foo.UnknownCode)
    })

    // https://github.com/domenic/chai-as-promised

    it('FooErr ok', function() {
        var p = yoo.fooPromise(109, 'testFooErr')
            // return assert.eventually.equal(p,9991)
            // return assert.eventually.isNumber(p,9991)
            // return assert.becomes(p,9991)
            // return p.should.become(9991)
        return p.should.become(9991)
    })
})

describe('RedBot', function() {
    it('fooTest', function() {

        yoo.updateBitoex({
            sell: 10000,
            buy: 11000
        })
        yoo.updateMaicoin({
            sell_price: "8000.00",
            buy_price: "10000.00"
        })
        var r = yoo.btctwd
        var b = r.bitoex
        var m = r.maicoin
        assert.equal(10500, b.avg)
        assert.equal(9000, m.avg)
        assert.equal(9750, r.avg)
        var x = Yoo.toTwd(yoo.calcTwd(1.0))
        console.log(x)
        console.log(Yoo.toTwd(yoo.calcTwd(0.5)))
    })
    it('btctwdTest', function() {
        var r = Yoo.parseCmd('/y12 btctwd 0.1234')
        console.log(r)
        assert.equal('btctwd', r.cmd)
        assert.equal(0.1234, r.btc)
        console.log(Yoo.toTwd(yoo.calcTwd(r.btc)))
        var r = Yoo.parseCmd('/y12')
        console.log(r)
        assert.equal('btctwd', r.cmd)
    })

    it('tbtcParseTest', function() {
        var tbtc = Yoo.parseCmd('/y12 tbtc')
        console.log(tbtc)
        assert.equal('tbtc', tbtc.cmd)
        assert.equal(1, tbtc.kid)
        assert.equal(2, Yoo.parseCmd('/y12 tbtc 2').kid)
        assert.equal(1, Yoo.parseCmd('/y12 tbtc 0.123').kid)
        assert.equal(1, Yoo.parseCmd('/y12 tbtc -1000').kid)
    })

    it('tbtcPrivateTest', function() {
        var param = {
            username: 'y12',
            token: 'haha',
            chattype: 'private'
        }

        return expect(Yoo.handleCmd(new Yoo(), '/y12 tbtc 1', param)).to.eventually.contain('KEY')

    })

    it('helpTest', function() {
        var param = {
            username: 'y12UserName',
            token: 'haha',
            chattype: 'private'
        }

        return expect(Yoo.handleCmd(new Yoo(), '/y12 help', param)).to.eventually.contain('y12UserName')
    })

    it('tbutxoTest', function() {
        var pc = Yoo.parseCmd('/y12 tbutxo')
        console.log(pc)
        assert.equal('tbutxo', pc.cmd)
        assert.equal(1, pc.kid)
        assert.equal(2, Yoo.parseCmd('/y12 tbutxo 2').kid)
    })


})

describe('AccountKeyInfoTest', function() {
    it('bitcoinHdKeyTests', function() {
        var hdkey = Yoo.getHDPrivateKey('Hello TestBot')
        console.log(hdkey.toJSON())
        assert.equal('testnet', hdkey.network)
        var hdkey2 = Yoo.getHDPrivateKey('Hello TestBot')
        console.log(hdkey2)
        assert.equal(hdkey.toString(), hdkey2.toString())
        var hdkey3 = Yoo.getHDPrivateKey('Hello TestBot3', {
            network: bitcorelib.Networks.livenet
        })
        console.log(hdkey3.toJSON())
        assert.equal('livenet', hdkey3.network)

        var dpk = Yoo.getDeriveKey(hdkey, 1)
        console.log(dpk.toJSON())
        var pk = dpk.privateKey
        assert.equal('tprv8gx25CZwYW93N5WqBqBtmtm5mchMHZhseePqZvc4jRZive54jtZEHxJ1CNTf26tQJtr4p6qfT88JHYSv4sEihWD9iTKPXNir1aGr6fbNnEF', dpk.xprivkey)
        expect('mhbb8V6ptAutyd2mwEnRDDPJ3cDYQgaSCu').to.equal(pk.toAddress().toString())
    })

    it('accountUsernameTests', function() {
        var keyInfo1 = Yoo.getAccountKeyInfo(1, {
            username: 'JLY12',
            token: '123456'
        })
        var keyInfo2 = Yoo.getAccountKeyInfo(1, {
            username: 'jLy12',
            token: '123456'
        })
        var keyInfo3 = Yoo.getAccountKeyInfo(199, {
            username: 'jLy12',
            token: '123456'
        })
        console.log(keyInfo1, keyInfo2)
        expect(keyInfo2.seed).to.equal('JLY12haha:)123456')
        expect(keyInfo1.addr).to.equal(keyInfo2.addr)
        expect(keyInfo2.addr).to.not.equal(keyInfo3.addr)
    })

})

describe('CreateSignTx', function() {
    var utxo = {
        "address": "mmDaX8jn8HkBJxHjcszytd5MU6C6FmNouV",
        "txid": "c2edd7b1bfc02efdcf2b8450fd306022ffb03dae608475aa4a0c48d8a5c1f848",
        "vout": 0,
        "scriptPubKey": "76a9143e8781c650bc69cf1903935868f8ec2e929265cd88ac",
        "amount": 27.5
    }

    var keyInfo = Yoo.getAccountKeyInfo(1, {
        username: 'Y12TestApp',
        token: 'hahaToken'
    })

    var addrTo = 'mr5zAVwqpFUVu6vVdoAZq7SzFM1wedbSuD'
    var amountTo = 1.5
    var addrChange = keyInfo.addr
    var amount = 22
    var privateKey = keyInfo.pk

    it("Utxos OK", function() {
        var utxos = _.map([utxo], UnspentOutput)
        var p = Yoo.createSignTx(utxos, addrTo, addrChange, amountTo, privateKey).then(function(v) {
            console.log(v.toJSON())
        })
        return p.should.be.fulfiled
    })

    it("Utxos Total AmountIn < Fee", function() {
        utxo.amount = 0.00001
        var utxos = _.map([utxo], UnspentOutput)
        var p = Yoo.createSignTx(utxos, addrTo, addrChange, amountTo, privateKey)
        return treject(p, errors.Tx.Amount)
    })

    it("Utxos Total AmountOut + Fee >= AmountIn", function() {
        utxo.amount = 1.51
        var amountTo = 1.81
        var utxos = _.map([utxo], UnspentOutput)
        var p = Yoo.createSignTx(utxos, addrTo, addrChange, amountTo, privateKey)
        return treject(p, errors.Tx.Amount)
    })

    it("Utxos Total AmountOut + Fee = AmountIn", function() {
        utxo.amount = 1.501
        var amountTo = 1.5
        var utxos = _.map([utxo], UnspentOutput)
        return Yoo.createSignTx(utxos, addrTo, addrChange, amountTo, privateKey).then(function(r) {
            assert.isNotNull(r)
        }).catch(function(err) {
            console.log(err)
            assert.fail()
        })
    })
})

describe('ExternalDep', function() {

    var debugGetUtxos = false

    it('tbutxoTest', function() {
        var param = {
            username: 'y12UserName',
            token: 'haha',
            chattype: 'private'
        }
        if (debugGetUtxos) {
            return expect(Yoo.handleCmd(new Yoo(), '/y12 tbutxo 2', param)).to.eventually.contain('amount')
        }
    })

    it('bitcoinUtxoTests', function() {

        var keyInfo = Yoo.getAccountKeyInfo(1, {
            username: 'Y12TestApp',
            token: 'hahaToken'
        })
        expect(keyInfo).to.have.property('addr')
            // https://live.blockcypher.com/btc-testnet/address/mmDaX8jn8HkBJxHjcszytd5MU6C6FmNouV/
        var debugGetUtxos = false
        if (debugGetUtxos) {
            return Yoo.getUtxos(keyInfo.addr, 1).then(function(res){
                console.log(JSON.stringify(res, null, 2))
                assert.equal(res.confirmations, 1)

                // mr5zAVwqpFUVu6vVdoAZq7SzFM1wedbSuD
                var utxos = res.cfutxos
                var addrTo = 'mr5zAVwqpFUVu6vVdoAZq7SzFM1wedbSuD'
                var addrChange = keyInfo.addr
                var amount = 22
                var privateKey = keyInfo.pk
                var p = Yoo.createSignTx(utxos, addrTo, addrChange, amountTo, privateKey).then(function(tx){
                    console.log(tx.toJSON())
                })
                p.should.be.fulfiled
            })
        }
    })
})
