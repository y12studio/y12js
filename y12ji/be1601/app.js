var bitcorelib = require('bitcore-lib')
var explorers = require('bitcore-explorers')
var Message = require('bitcore-message')
var ethutil = require('ethereumjs-util')
var ECDSA = bitcorelib.crypto.ECDSA;
var PrivateKey = bitcorelib.PrivateKey;
var PublicKey = bitcorelib.PublicKey;
var Address = bitcorelib.Address;

function scard() {}

scard.getFoo = function(str) {
    return 'Foo-' + str;
}

// cryptography - Which cryptographic hash function does Ethereum use? - Ethereum Stack Exchange
//  http://ethereum.stackexchange.com/questions/550/which-cryptographic-hash-function-does-ethereum-use
// Rename/alias sha3 to minimize confusion with SHA-3 standard · Issue #59 · ethereum/EIPs
//  https://github.com/ethereum/EIPs/issues/59
scard.keccak256 = function(str) {
    var hash = ethutil.sha3(new Buffer(str))
    return {
        hex: hash.toString('hex'),
        raw: hash
    }
}

scard.ecrecover = function(hashhex, v, rhex, shex) {
    // buffer
    // publicKey = utils.ecrecover(msgHash, v, r, s)
    var r = new Buffer(rhex, 'hex')
    var s = new Buffer(shex, 'hex')
    var echash = new Buffer(hashhex, 'hex')
    return ethutil.ecrecover(echash, v, r, s)
}

scard.signBtcMsg = function(msg, privateKey) {
    // sha256sha256(prefix+x)
    var m = Message(msg)
    var esign = m._sign(privateKey)
    return {
        msg : msg,
        r: esign.r.toString('hex'),
        s: esign.s.toString('hex'),
        i: esign.i,
        base64: esign.toCompact().toString('base64'),
        raw: esign
    }
}

scard.recoverEcdsaPubKey = function(msg, signatureBc) {
    var m = Message(msg)
        // recover the public key
    var ecdsa = new ECDSA();
    ecdsa.hashbuf = m.magicHash();
    ecdsa.sig = signatureBc;
    return ecdsa.toPublicKey();
}

module.exports = {
    bitcorelib: bitcorelib,
    buffer : require('buffer'),
    explorers: explorers,
    Message: Message,
    ethutil: ethutil,
    scard: scard
}
