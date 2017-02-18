var bitcore = require('bitcore-lib')
var Unit = bitcore.Unit
var HDPrivateKey = bitcore.HDPrivateKey
var Hash = bitcore.crypto.Hash
var Buffer = bitcore.deps.Buffer

function BcLib() {
}

BcLib.exToBtc = function(amount,rate){
    return Unit.fromFiat(amount, rate)
}

BcLib.floatToBtc = function(floatNum){
    return Unit.fromBTC(floatNum).BTC
}



BcLib.rankey = function() {
    var hd = new HDPrivateKey()
    var key = hd.privateKey
    return {
        key: key,
        keyhex: key.toString('Hex'),
        address: key.toAddress().toString()
    }
}

module.exports = BcLib
