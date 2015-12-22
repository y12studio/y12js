var sc = require('../app')
var assert = require('chai').assert
var scard = sc.scard
var bitcorelib = sc.bitcorelib
var Mnemonic = sc.Mnemonic

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('HDC1501', function() {
    describe('scard', function() {
        it('build', function() {
            var rs = scard.buildtw('helloabc', 12)
            var rs24 = scard.buildtw('helloabc', 24)
            var mcode = "堡 興 扶 證 改 光 歸 闊 豪 庭 劉 化"
            console.log(rs)
            assert.equal(mcode, rs.code.toString())
            assert.equal("堡 興 扶 證 改 光 歸 闊 豪 庭 劉 力 麼 玩 淀 怨 若 建 格 銷 延 構 柱 臂", rs24.code.toString())
            var rd = scard.derivetw(mcode, 1, 0, 5)
            console.log(rd)
            assert.isUndefined(rd.error)
            assert.equal(rd.xpriv.toString(), rs.xpriv.toString())

            var mcodeerr1 = scard.derive('', 'ZH_TW', 1, 2, 3)
            assert.isDefined(mcodeerr1.error)
            var mcodeerr2 = scard.derive('扶 證 改 光 歸 闊 豪 庭', 'ZH_TW', 1, 2, 3)
            assert.isDefined(mcodeerr2.error)
            var mcodeerr3 = scard.derive('堡 興 扶 證 改 光 歸 闊 豪 庭 劉 力 麼 玩 淀 怨 若 建 格 銷 延 構 柱 臂 x', 'ZH_TW', 1, 2, 3)
            assert.isDefined(mcodeerr3.error)
            assert.isUndefined(mcodeerr3.xpriv)

            var rsch = scard.build('helloabc', 'ZH_CN')
            var rsen = scard.build('helloabc', 'EN')
            var rsjp = scard.build('helloabc', 'JP', 15)
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
    var fzcr = scard.fzcRedeemScript(2016, 1, 5, 12, 30, privKey)
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
            var rs = scard.fzcRedeemScript(2016, 1, 5, 12, 30, privKey)
            //console.log(rs)
            assert.isUndefined(rs.error)
            assert.equal(1454646600, rs.locktime)
                // Chain Query: Bitcoin API: decodescript
                // https://chainquery.com/bitcoin-api/decodescript
            assert.equal('044825b456b17576a91433b94b70bbd434f0ad01925669bedf3469832b5888ac', rs.hex)
            assert.equal('4825b456 OP_NOP2 OP_DROP OP_DUP OP_HASH160 33b94b70bbd434f0ad01925669bedf3469832b58 OP_EQUALVERIFY OP_CHECKSIG', rs.asm)
            assert.equal('3MEQAxLowNdWAPAuYdfChgkYEayZiWD9NK', rs.address.toString())
            assert.equal('OP_HASH160 d659db56de1a334b980d411ad6e9e20b200684b3 OP_EQUAL', rs.scriptPubKey.toASM())

            var rs2 = scard.fzcRedeemScript(2016, 2, 5, 12, 30, privKey)
            assert.equal('3A6r4mLuGyhrn2Qi2dHf6Gj7PbM4moByba', rs2.address.toString())
        })

        it('bip65 spend test', function() {
            var tr = getTestP2ShUtxo()
            assert.equal('044825b456b17576a914b10a0613dd1ffc0c76da94e033ae7c81b7d0099888ac', tr.fzcr.hex)
            //console.log(tr.utxo.toJSON())
            var txspbip65 = scard.fzcGetSpendTransaction(tr.fzcr, tr.utxo, tr.addr2, 100002222)
            // txspbip65.inputs[0].script.toASM() = sig pubkey redeemscript
            assert.equal('30440220039146520d73aa58293be320d24f5939c0d6a2d8a6d53aa86f9dced4e75c0ee20220406cfae5e60a9e6d4e1f045384be7c6f57581e70a67fcc891c245ad813a0425c01 03b2530111ce43d247ad89820c31daedaf99152df7313bf173d0f8c134f333eb1d '+ tr.fzcr.hex,txspbip65.inputs[0].script.toASM())
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
