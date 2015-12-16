var bitcorelib = require('bitcore-lib')
var Mnemonic = require('bitcore-mnemonic')
var ZH_TW_WORDLIST = require('./chinese_traditional.json')
Mnemonic.Words.CHINESE_TRADITIONAL = ZH_TW_WORDLIST

function scard() {}

scard.langs = ['ZH_TW', 'ZH_CN', 'EN', 'JP']

scard.langdesc = {
    'ZH_TW': '正體中文',
    'ZH_CN': '簡體中文',
    'EN': '英文',
    'JP': '日文'
}

scard.langwordmap = {
    'ZH_TW': Mnemonic.Words.CHINESE_TRADITIONAL,
    'ZH_CN': Mnemonic.Words.CHINESE,
    'EN': Mnemonic.Words.ENGLISH,
    'JP': Mnemonic.Words.JAPANESE
}

scard.buildtw = function(seedStr, wordsize) {
    return scard.build(seedStr, 'ZH_TW', wordsize)
}

scard.derivetw = function(mcode, account, channel, kid) {
    return scard.derive(mcode, 'ZH_TW', account, channel, kid)
}

scard.build = function(seedStr, lang, wordsize) {
    // 12,15,18,21,24=128~256
    var wsize = wordsize || 12
    var wordlist = scard.langwordmap[lang] || Mnemonic.Words.CHINESE_TRADITIONAL
    var buf = new bitcorelib.deps.Buffer(seedStr)
    var buf256 = bitcorelib.crypto.Hash.sha256(buf)
    var entSize = wsize * 4 / 3
    var bufEnt = buf256.slice(0, entSize)
    var code = new Mnemonic(bufEnt, wordlist)
    var xpriv = code.toHDPrivateKey()
    return {
        xpriv: xpriv,
        seed: seedStr,
        code: code.toString()
    }
}

scard.derive = function(mcode, lang, account, channel, kid) {
    var mspace = (mcode.match(/\s/g) || []).length
    if (mspace < 11 || mspace > 23) {
        return {
            error: 'mcode error',
            mcode: mcode
        }
    }
    var wordlist = scard.langwordmap[lang] || Mnemonic.Words.CHINESE_TRADITIONAL
    var code = new Mnemonic(mcode, wordlist);
    var xpriv = code.toHDPrivateKey()
    var exkey = xpriv.derive(account, true).derive(channel).derive(kid)
    var key = exkey.privateKey
    return {
        xpriv: xpriv,
        mcode: mcode,
        account: account,
        channel: channel,
        kid: kid,
        key: key,
        ktitle: 'm/' + account + 'h/' + channel + "/" + kid,
        address: key.toAddress().toString(),
        wif: key.toWIF()
    }
}

module.exports = {
    Mnemonic: Mnemonic,
    bitcorelib: bitcorelib,
    scard: scard
}
