var secrets = require('secrets.js-grempe')
var bip39 = require('bip39')
var bitcorelib = require('bitcore-lib')
var ZH_TW_WORDLIST = require('./chinese_traditional.json')

function scard() {}

scard.ranHex = function(bits) {
    return secrets.random(bits)
}

scard.shareToMshare = function(share, wordlist) {
    var id = share.substring(0, 3)
    var data = share.substring(3, share.length)
        // split word 160 bits 24 words
    return {
        id: id,
        data: data,
        code: bip39.entropyToMnemonic(data, wordlist)
    }
}

scard.mshareToShare = function(mshare, wordlist) {
    // 801xxxxxx
    var data = bip39.mnemonicToEntropy(mshare.code, wordlist)
    return mshare.id + data
}

scard.combine = function(mshares) {
    var wordlist = ZH_TW_WORDLIST
    var shares = []
    mshares.forEach(function(e, i, a) {
        shares.push(scard.mshareToShare(e,wordlist))
    })
    var keyhex = secrets.combine(shares)
    var keycode = bip39.entropyToMnemonic(keyhex, wordlist)
    var pk = new bitcorelib.PrivateKey(keyhex)
    return {
        pk:pk,
        address:pk.toAddress().toString(),
        wif:pk.toWIF(),
        keycode : keycode,
        shares: shares,
        keyhex:keyhex
    }

}

scard.split = function(seedStr, share, threshold) {
    var wordlist = ZH_TW_WORDLIST
    var buf = new bitcorelib.deps.Buffer(seedStr)
    var bufSr160 = bitcorelib.crypto.Hash.sha256ripemd160(buf)
    var pk = scard.pkFromBcBuf(bufSr160)
    var keyhex = bufSr160.toString('hex')
        // 160 bits words 15, 128 words 12 , 256 words 24
    var keycode = bip39.entropyToMnemonic(keyhex, wordlist)
    var shares = secrets.share(keyhex, share, threshold);
    var mshares = []
    var mshareCombs = []
    shares.forEach(function(e, i, a) {
        // split word 160 bits 24 words
        var m = scard.shareToMshare(e, wordlist)
        mshares.push(m)
        mshareCombs.push(scard.mshareToShare(m, wordlist))
    })
    return {
        pk: pk,
        address: pk.toAddress().toString(),
        wif: pk.toWIF(),
        seed: seedStr,
        share: share,
        threshold: threshold,
        keyhex: keyhex,
        keycode: keycode,
        mshares: mshares,
        mshareCombs: mshareCombs,
        shares: shares
    }
}

scard.stringToHex = function(str) {
    return scard.bcBufFromString(str).toString('hex')
}

scard.bcBufSr160FromHex = function(hex) {
    return bitcorelib.crypto.Hash.sha256ripemd160(scard.bcBufFromHex(hex))
}

scard.sr160hexFromStr = function(str) {
    return bitcorelib.crypto.Hash.sha256ripemd160(scard.bcBufFromString(str)).toString('hex')
}

scard.bcBufFromString = function(str) {
    return new bitcorelib.deps.Buffer(str)
}

scard.bcBufFromHex = function(hex) {
    return new bitcorelib.deps.Buffer(hex, 'hex')
}

scard.pkFromBcBuf = function(buf) {
    var bn = bitcorelib.crypto.BN.fromBuffer(buf);
    return new bitcorelib.PrivateKey(bn);
}

module.exports = {
    secrets: secrets,
    bip39: bip39,
    bitcorelib: bitcorelib,
    scard: scard
}
