var app = require('../app')
var assert = require('chai').assert
var ybmc = app.ybmc
var bitcorelib = app.bitcorelib
var Mnemonic = app.Mnemonic
var Networks = bitcorelib.Networks

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('YBMC', function() {
    describe('ybmc', function() {
        it('default network is testnet', function() {
            var rb = ybmc.build('helloabc', 'EN')
            console.log(rb)
            assert.equal(Networks.testnet.name, rb.xpriv.network.name)
        })
        it('set network to livenet', function() {
            var rb = ybmc.build('helloabc', 'EN', 12, {network:Networks.livenet})
            console.log(rb)
            assert.equal(Networks.livenet.name, rb.xpriv.network.name)
        })
        it('buildTw', function() {
            var rs = ybmc.buildTw('helloabc', 12)
            var mcode = "堡 興 扶 證 改 光 歸 闊 豪 庭 劉 化"
            console.log(rs)
            assert.equal(mcode, rs.code.toString())

            var rs24 = ybmc.buildTw('helloabc', 24)
            assert.equal("堡 興 扶 證 改 光 歸 闊 豪 庭 劉 力 麼 玩 淀 怨 若 建 格 銷 延 構 柱 臂", rs24.code.toString())
        })
        it('buildTwPassword', function() {

            var opt = {password:'hellopass1234'}

            var rs = ybmc.buildTw('helloabc', 18, opt)
            console.log(rs)
            var mcode = '堡 興 扶 證 改 光 歸 闊 豪 庭 劉 力 麼 玩 淀 怨 若 提'
            assert.equal(mcode, rs.code.toString())
            var rd = ybmc.deriveTwByCodes(mcode, 1, 0, 5)
            var rdWithPass = ybmc.deriveTwByCodes(mcode, 1,0,5,opt);
            console.log(rd)
            assert.notEqual(rs.xpriv.toString(), rd.xpriv.toString())
            assert.equal(rs.xpriv.toString(),rdWithPass.xpriv.toString())

        })
        it('dertivetw', function() {
            var rs = ybmc.buildTw('helloabc', 12)
            var rd = ybmc.deriveTwByCodes(rs.code.toString(), 1, 0, 5)
            console.log(rd)
            assert.isUndefined(rd.error)
            assert.equal(rd.xpriv.toString(), rs.xpriv.toString())

            var mcodeerr1 = ybmc.deriveByCodes('', 'ZH_TW', 1, 2, 3)
            assert.isDefined(mcodeerr1.error)
            var mcodeerr2 = ybmc.deriveByCodes('扶 證 改 光 歸 闊 豪 庭', 'ZH_TW', 1, 2, 3)
            assert.isDefined(mcodeerr2.error)
            var mcodeerr3 = ybmc.deriveByCodes('堡 興 扶 證 改 光 歸 闊 豪 庭 劉 力 麼 玩 淀 怨 若 建 格 銷 延 構 柱 臂 x', 'ZH_TW', 1, 2, 3)
            assert.isDefined(mcodeerr3.error)
            assert.isUndefined(mcodeerr3.xpriv)

            var rsch = ybmc.build('helloabc', 'ZH_CN')
            var rsen = ybmc.build('helloabc', 'EN')
            var rsjp = ybmc.build('helloabc', 'JP', 15)
            assert.equal('堡 兴 扶 证 改 光 归 阔 豪 庭 刘 化', rsch.code.toString())
            assert.equal('walnut entire swing certain chair can lamp salute still limit gloom answer', rsen.code.toString())
            assert.equal('らぞく　ごうきゅう　ほうりつ　おもたい　おもちゃ　おがむ　そうがんきょう　のりもの　ふはい　そもそも　したて　いじゅう　うえる　ひこく　ひうん', rsjp.code.toString())
        })
    })
})

function getTestP2KeyHashUtxo() {
    var privKey = getTestPk('alicetx')
    var inputaddr = privKey.toAddress()
    var scriptTx = bitcorelib.Script.buildPublicKeyHashOut(inputaddr);
    var sampleData2 = {
        'txid': 'e42447187db5a29d6db161661e4bc66d61c3e499690fe5ea47f87b79ca573986',
        'vout': 1,
        'address': inputaddr.toString(),
        'scriptPubKey': scriptTx,
        'amount': 109.01080000
    }
    var utxo = bitcorelib.Transaction.UnspentOutput(sampleData2)
    var privKey2 = getTestPk('alicetx2')

    return {
        pk: privKey,
        pk2: privKey2,
        addr: inputaddr,
        addr2: privKey2.toAddress(),
        utxo: utxo
    }
}

function getTestPk(str) {
    return new bitcorelib.PrivateKey(bitcorelib.crypto.Hash.sha256(new Buffer(str, 'utf8')).toString('hex'))
}

function getTestP2ShUtxo() {
    var privKey = getTestPk('alicetx')
    var fzcr = ybmc.fzcRedeemScript(2029, 1, 5, 12, 30, privKey)
    var addr = fzcr.address.toString()
    var sampleData2 = {
        'txid': 'e42447187db5a29d6db161661e4bc66d61c3e499690fe5ea47f87b79ca573986',
        'vout': 1,
        'address': addr,
        'scriptPubKey': fzcr.scriptPubKey,
        'amount': 109.01080000
    }
    var utxo = bitcorelib.Transaction.UnspentOutput(sampleData2)
    var privKey2 = getTestPk('alicetx2')
    var privKey3 = getTestPk('alicetx3')

    return {
        fzcr: fzcr,
        pk2: privKey2,
        addr2: privKey2.toAddress(),
        addrcg: privKey3.toAddress(),
        utxo: utxo
    }
}


describe('FZC1501', function() {
    describe('BIP65 Test', function() {
        it('bip65 redeemscript test', function() {
            // address = mkESjLZW66TmHhiFX8MCaBjrhZ543PPh9a
            // privKey WIF = cP3voGKJHVSrUsEdrj8HnrpwLNgNngrgijMyyyRowRo15ZattbHm
            var privKey = new bitcorelib.PrivateKey(bitcorelib.crypto.Hash.sha256(new Buffer('alice', 'utf8')).toString('hex'))
            var rs = ybmc.fzcRedeemScript(2016, 1, 5, 12, 30, privKey)
                //console.log(rs)
            assert.isUndefined(rs.error)
            assert.equal(1454646600, rs.locktime)
            assert.isDefined(rs.date)
                // Chain Query: Bitcoin API: decodescript
                // https://chainquery.com/bitcoin-api/decodescript
            assert.equal('044825b456b17576a91433b94b70bbd434f0ad01925669bedf3469832b5888ac', rs.hex)
            assert.equal('4825b456 OP_NOP2 OP_DROP OP_DUP OP_HASH160 33b94b70bbd434f0ad01925669bedf3469832b58 OP_EQUALVERIFY OP_CHECKSIG', rs.asm)
            assert.equal('3MEQAxLowNdWAPAuYdfChgkYEayZiWD9NK', rs.address.toString())
            assert.equal('OP_HASH160 d659db56de1a334b980d411ad6e9e20b200684b3 OP_EQUAL', rs.scriptPubKey.toASM())

            var rs2 = ybmc.fzcRedeemScript(2016, 2, 5, 12, 30, privKey)
            assert.equal('3A6r4mLuGyhrn2Qi2dHf6Gj7PbM4moByba', rs2.address.toString())
        })

        it('bip65 spend test', function() {
            var tr = getTestP2ShUtxo()
            assert.equal('04c808296fb17576a914b10a0613dd1ffc0c76da94e033ae7c81b7d0099888ac', tr.fzcr.hex)
                //console.log(tr.utxo.toJSON())
            var txspbip65 = ybmc.fzcGetSpendTransaction(tr.fzcr, tr.utxo, tr.addr2, 100002222)
                // txspbip65.inputs[0].script.toASM() = sig pubkey redeemscript
            assert.equal('30440220753a3988ce76604884205e02b9c0fea1605362fa993b97c29603659040465c5a02207696a71e5f18b3ba5137e054e7b01096a51d47afe3ce9590e0d936191eff6b8c01 03b2530111ce43d247ad89820c31daedaf99152df7313bf173d0f8c134f333eb1d ' + tr.fzcr.hex, txspbip65.inputs[0].script.toASM())
            console.log(txspbip65.toJSON())
            console.log(txspbip65.serialize(true))
        })

        it('p2keyhashtest', function() {
            // fake UnspentOutput
            var tr = getTestP2KeyHashUtxo()
            var transaction = new bitcorelib.Transaction()
                .from(tr.utxo) // Feed information about what unspent outputs one can use
                .to(tr.addr2, 101080000).change(tr.addr).sign(tr.pk)
                //console.log(transaction.toJSON())
                //console.log(transaction.serialize())
            assert.isDefined(transaction.serialize())
        })
    })
})
