var bitcorelib = require('bitcore-lib')
var UnspentOutput = bitcorelib.Transaction.UnspentOutput
var _ = require('lodash')
var Yoo = require('../yoo')
var yoo = new Yoo()
var assert = require('chai').assert

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});


describe('FooPromise', function() {

    it("fooPromiseStringErrorTest", function() {
        return yoo.fooPromise(6000, 300).then(assert.fail).catch(function(err) {
            console.log('err', err)
            assert.equal(err.message, 'Invalid string');
        })
    })

    _.forEach(['xxxxx', 50, 0, -19], function(v) {
        it("fooPromiseIntErrorTest intValue=" + v, function() {
            return yoo.fooPromise(v, 'xxxx').then(assert.fail).catch(function(err) {
                assert.equal(err.message, 'intValue must greater than 100')
            })
        })
    })

    it("fooPromiseIntOkTest", function() {
        return yoo.fooPromise(15000, 'xxxx').then(function(data) {
            assert.equal(data, 15100)
        }).catch(assert.fail)
    })

    it("fooPromiseIntResultErrorTest", function() {
        return yoo.fooPromise(200, 'xxxx').then(assert.fail).catch(function(err) {
            console.log(err)
            assert.equal(err.message, 'Result Error')
        })
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
        var x = yoo.toTwd(1.0)
        console.log(x)
        console.log(yoo.toTwd(0.5))
    })
    it('btctwdTest', function() {
        var r = yoo.parseCmd('/y12 btctwd 0.1234')
        console.log(r)
        assert.equal('btctwd', r.cmd)
        assert.equal(0.1234, r.btc)
        console.log(yoo.toTwd(r.btc))
        var r = yoo.parseCmd('/y12')
        console.log(r)
        assert.equal('btctwd', r.cmd)
    })

    it('tbtcParseTest', function() {
        var tbtc = yoo.parseCmd('/y12 tbtc')
        console.log(tbtc)
        assert.equal('tbtc', tbtc.cmd)
        assert.equal(1, tbtc.kid)
        assert.equal(2, yoo.parseCmd('/y12 tbtc 2').kid)
        assert.equal(1, yoo.parseCmd('/y12 tbtc 0.123').kid)
        assert.equal(1, yoo.parseCmd('/y12 tbtc -1000').kid)
    })

    it('tbtcPrivateTest', function(done) {
        yoo.handleCmd('/y12 tbtc 1', {
                username: 'y12',
                token: 'haha',
                chattype: 'private'
            },
            function(err, res) {
                console.log(res)
                assert.isTrue(res.indexOf('KEY') > 0)
                done()
            })
    })

    it('helpTest', function(done) {
        yoo.handleCmd('/y12 help', {
                username: 'y12',
                token: 'haha',
                chattype: 'private'
            },
            function(err, res) {
                console.log(res)
                assert.isTrue(res.indexOf('y12') >= 0)
                done()
            })
    })

    it('tbutxoTest', function(done) {
        yoo.handleCmd('/y12 tbutxo 2', {
                username: 'y12',
                token: 'haha',
                chattype: 'private'
            },
            function(err, res) {
                console.log(res)
                assert.isTrue(res.indexOf('amount') > 0)
                done()
            })
    })

    it('tbutxoTest', function() {
        var pc = yoo.parseCmd('/y12 tbutxo')
        console.log(pc)
        assert.equal('tbutxo', pc.cmd)
        assert.equal(1, pc.kid)
        assert.equal(2, yoo.parseCmd('/y12 tbutxo 2').kid)
    })

    it('bitcoinHdKeyTests', function() {
        var hdkey = yoo.getHDPrivateKey('Hello TestBot')
        console.log(hdkey.toJSON())
        assert.equal('testnet', hdkey.network)
        var hdkey2 = yoo.getHDPrivateKey('Hello TestBot')
        console.log(hdkey2)
        assert.equal(hdkey.toString(), hdkey2.toString())
        var hdkey3 = yoo.getHDPrivateKey('Hello TestBot3', {
            network: bitcorelib.Networks.livenet
        })
        console.log(hdkey3.toJSON())
        assert.equal('livenet', hdkey3.network)

        var dpk = yoo.getDeriveKey(hdkey, 1)
        console.log(dpk.toJSON())
        var pk = dpk.privateKey
        assert.equal('tprv8gx25CZwYW93N5WqBqBtmtm5mchMHZhseePqZvc4jRZive54jtZEHxJ1CNTf26tQJtr4p6qfT88JHYSv4sEihWD9iTKPXNir1aGr6fbNnEF', dpk.xprivkey)
        var addr = pk.toAddress().toString()
        assert.equal('mhbb8V6ptAutyd2mwEnRDDPJ3cDYQgaSCu', addr)
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

    it("Utxos", function() {
        var utxos = _.map([utxo], UnspentOutput)
        return yoo.createSignTx(utxos, null, null, null, null).then(function(data) {
            assert.isNotNull(data)
        }).catch(function(err) {
            console.log(err)
            assert.fail()
        })
    })

    it("Utxos Total AmountIn < Fee", function() {
        utxo.amount = 0.00001
        var utxos = _.map([utxo], UnspentOutput)
        return yoo.createSignTx(utxos, null, null, null, null).then(assert.fail).catch(function(err) {
            console.log(err)
            assert.include(err.message,'Amount 1000 < Fee 100000')
        })
    })

    it("Utxos Total AmountOut + Fee >= AmountIn", function() {
        utxo.amount = 1.51
        var amountTo = 1.81
        var utxos = _.map([utxo], UnspentOutput)
        return yoo.createSignTx(utxos, null, null, amountTo, null).then(assert.fail).catch(function(err) {
            console.log(err)
            assert.include(err.message,'AmountIn 151000000 + Fee 100000 < AmountOut 181000000')
        })
    })

    it("Utxos Total AmountOut + Fee = AmountIn", function() {
        utxo.amount = 1.501
        var amountTo = 1.5
        var utxos = _.map([utxo], UnspentOutput)
        return yoo.createSignTx(utxos, null, null, amountTo, null).then(function(r){
            assert.isNotNull(r)
        }).catch(function(err) {
            console.log(err)
            assert.fail()
        })
    })

    var testUtxosTarget = [100, 'xxx', ['xxx'],
        [1],
        [{
            foo: 100
        }]
    ]

    _.forEach(testUtxosTarget, function(v) {
        it("createSignTxTest Utxos Error " + JSON.stringify(v), function() {
            return yoo.createSignTx(v, null, null, null, null).then(assert.fail).catch(function(err) {
                console.log(err)
                assert.include(err.message, 'UTXOs Error')
            })
        })
    })
})

describe('ExternalDep', function() {
    it('bitcoinUtxoTests', function(done) {

        var keyInfo = yoo.getAccountKeyInfo(1, {
            username: 'y12testApp',
            token: 'hahaToken'
        })
        //console.log(keyInfo)
        assert.equal(keyInfo.addr, 'mmDaX8jn8HkBJxHjcszytd5MU6C6FmNouV')
            // https://live.blockcypher.com/btc-testnet/address/mmDaX8jn8HkBJxHjcszytd5MU6C6FmNouV/
        var debugGetUtxos = false
        if (debugGetUtxos) {
            yoo.getUtxos(keyInfo.addr, 1, function(err, res) {
                console.log(JSON.stringify(res, null, 2))
                assert.equal(res.confirmations, 1)

                // mr5zAVwqpFUVu6vVdoAZq7SzFM1wedbSuD
                var utxos = res.cfutxos
                var addrTo = 'mr5zAVwqpFUVu6vVdoAZq7SzFM1wedbSuD'
                var addrChange = keyInfo.addr
                var amount = 1.8
                var privateKey = keyInfo.pk
                var tx = yoo.createTx(utxos, addrTo, addrChange, amount, privateKey)
                console.log(tx)

                var debugSendto = false
                if (debugSendto) {
                    yoo.sendto(tx, function(err, res) {
                        console.log(res)
                        done()
                    })
                } else {
                    done()
                }
            })
        } else {
            done()
        }
    })
})
