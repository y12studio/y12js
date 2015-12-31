var sc = require('../app')
var assert = require('chai').assert
var scard = sc.scard
var bitcorelib = sc.bitcorelib
var Script = bitcorelib.Script;

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('BCP1501', function() {
    describe('scard', function() {
        it('build', function() {
            var tr = scard.getTestUtxo()
            console.log(tr)
            assert.equal('ac5439f777ea45f30ff14fee838c38c82074ac9f78799c865d1bbd2636802f7e',tr.key.toString())
            assert.equal('OP_DUP OP_HASH160 a96af0337ba5f91efb6853905c43a04bfb245b03 OP_EQUALVERIFY OP_CHECKSIG', tr.utxodata.scriptAsm)

            var key = tr.key
            var utxo = tr.utxo
            var addrto = tr.addrto
            var feeBtc = tr.fee

            var bcp = scard.buildBcp('00C273C9E3C092369bea16005253e617277ae0dff7ce1535bad60bdda030b982',key, utxo, addrto, feeBtc)
            var Y12JIBCP = '5931324a49424350'
            var SHA256 = '00c273c9e3c092369bea16005253e617277ae0dff7ce1535bad60bdda030b982'
            assert.equal(Y12JIBCP+SHA256,bcp.datahex)
            var obj = bcp.tx.toObject()
            output0 = obj.outputs[0]
            console.log(output0)
            assert.equal('6a28'+Y12JIBCP+SHA256,output0.script)
            assert.equal('OP_RETURN '+Y12JIBCP+SHA256,Script.fromHex(output0.script).toASM())
            assert.equal(0,output0.satoshis)
            assert.equal(100001234,obj.outputs[1].satoshis)
            console.log(bcp.txhex)
        })
    })
})
