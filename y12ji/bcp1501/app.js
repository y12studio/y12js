var bitcorelib = require('bitcore-lib')
var explorers = require('bitcore-explorers')
var Unit = bitcorelib.Unit

function scard() {}

scard.getPkHexFromTxt = function(str){
    return new bitcorelib.PrivateKey(bitcorelib.crypto.Hash.sha256(new Buffer(str, 'utf8')).toString('hex'))
}

scard.buildBcp = function(hex,key, utxo, addrto, feeBtc){
    return scard.buildOpReturn('Y12JIBCP',hex,key, utxo, addrto, feeBtc)
}

scard.buildOpReturn = function(prefix, hex, key, utxo, addrto, feeBtc){
    var Buffer = bitcorelib.deps.Buffer
    var prehex = new Buffer(prefix).toString('hex')
    var opBuf = new Buffer(prehex+hex.toLowerCase(), 'hex')
    var amount = utxo.toObject().amount
    var satoshisTo = Unit.fromBTC(amount - feeBtc).satoshis
    var tx = new bitcorelib.Transaction()
            .from(utxo)
            .addData(opBuf)
            .to(addrto,satoshisTo)
            .sign(key)
    return {
        datahex: opBuf.toString('hex'),
        txhex: tx.serialize(true),
        tx: tx
    }
}

scard.getTestUtxo = function() {
    var privateKey = scard.getPkHexFromTxt('TestBCP1501')
    var address = privateKey.toAddress()
    var scriptTx = bitcorelib.Script.buildPublicKeyHashOut(address)
    var utxodata =  {
        'txid': 'e42447187db5a29d6db161661e4bc66d61c3e499690fe5ea47f87b79ca573986',
        'vout': 1,
        'address': address.toString(),
        'scriptPubKey': scriptTx.toHex(),
        'scriptAsm':scriptTx.toASM(),
        'amount': 1.00011234
    }
    var utxo = bitcorelib.Transaction.UnspentOutput(utxodata)
    return {
        'key': privateKey,
        'utxo': utxo,
        'utxodata': utxodata,
        'fee': 0.00010000,
        'addrto': '1Y3P4m1nmCAEYyKQiZwcH1e4Mu44HNZEX'
    }
}


module.exports = {
    bitcorelib: bitcorelib,
    explorers: explorers,
    scard: scard
}
