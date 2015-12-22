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

scard.fzcRedeemScript = function(year, month, day, hours, minutes, privKey) {
    var tr = scard.getLockTime(year, month, day, hours, minutes);
    var redeemScript = bitcorelib.Script.empty()
        // useful generic way to get the minimal encoding of the locktime stack argument
        .add(bitcorelib.crypto.BN.fromNumber(tr.locktime).toScriptNumBuffer())
        .add('OP_NOP2').add('OP_DROP')
        .add(bitcorelib.Script.buildPublicKeyHashOut(privKey.toAddress()));
    var p2shAddress = bitcorelib.Address.payingTo(redeemScript);
    return {
        date: tr.date,
        locktime: tr.locktime,
        hex: redeemScript.toHex(),
        asm: redeemScript.toASM(),
        redeemScript: redeemScript,
        scriptPubKey: redeemScript.toScriptHashOut(),
        address: p2shAddress,
        privKey: privKey
    }
}

scard.getLockTime = function(year, month, day, hours, minutes) {
    var d = new Date(year, month, day, hours, minutes, 0, 0)
    var locktime = d.getTime() / 1000 | 0
    return {
        locktime: locktime,
        data: d
    }
}

scard.fzcGetSpendTransaction = function(fzcRedeemScript, utxo, addr2, satoshis) {
    var privKey = fzcRedeemScript.privKey
    var redeemScript = fzcRedeemScript.redeemScript
    var locktime = fzcRedeemScript.locktime

    var result = new bitcorelib.Transaction().from(utxo)
        .to(addr2, Number(satoshis))
        // CLTV requires the transaction nLockTime to be >= the stack argument in the redeem script
        .lockUntilDate(locktime)
    // the CLTV opcode requires that the input's sequence number not be finalized
    result.inputs[0].sequenceNumber = 0
        // sign(transaction, privateKey, sighashType, inputIndex, subscript)
    var signature = bitcorelib.Transaction.sighash.sign(
            result,
            privKey,
            bitcorelib.crypto.Signature.SIGHASH_ALL,
            0,
            redeemScript
        )
        // setup the scriptSig of the spending transaction to spend the p2sh-cltv-p2pkh redeem script
    var script = bitcorelib.Script.empty()
        .add(signature.toTxFormat())
        .add(privKey.toPublicKey().toBuffer())
        .add(redeemScript.toBuffer())
    result.inputs[0].setScript(script)
    return result
};



module.exports = {
    Mnemonic: Mnemonic,
    bitcorelib: bitcorelib,
    scard: scard
}
