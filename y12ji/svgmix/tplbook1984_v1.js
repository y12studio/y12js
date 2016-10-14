var _ = require('lodash')
var request = require('request')
var qr_cairo = require('qr-cairo')
var moment = require('moment')
var bitcorelib = require('bitcore-lib')
var Mnemonic = require('bitcore-mnemonic')
var generator = require('generate-password')
var ZH_TW_WORDLIST = require('./chinese_traditional.json')
Mnemonic.Words.CHINESE_TRADITIONAL = ZH_TW_WORDLIST
var Networks = bitcorelib.Networks

require('shelljs/global')

var bookId = require('./bookid.local.json')

bookId.password = generator.generate({
    length: 16,
    numbers: true
});

bookId.seed = generator.generate({
    length: 32,
    numbers: true
}) + bookId.seed + generator.generate({
    length: 32,
    numbers: true
})

//var bookId = {
//    ver: 'B1984-A01',
//    printedDate: '1984',
//    password: 'PassY12JIBook',
//    seed: 'HelloY12JIBookLive',
//    btc: 0.00568
//}

const tplAddr1 = 'm1ESjLZW66TmHhiFX81CaBjrhZ543PPh9a'
const tplAddr2 = 'm2ESjLZW66TmHhiFX81CaBjrhZ543PPh9a'
const tplWif1 = 'K1fFV7VZ5QzikdXYPeSbzCDsxPCSQNvoHBRL2RPK7Tu8gdpkcxHq'
const tplWif2 = 'K2fFV7VZ5QzikdXYPeSbzCDsxPCSQNvoHBRL2RPK7Tu8gdpkcxHq'

const tplVersion = 'VvvvV-A01'
const tplDate = 'y016-m9-d9'
const tplPrintedDate = 'y984'
const tplBtc = 'v00888v'
const tplBtcUsd = 'v600v'
const tplBtcTwd = 'v16800v'
const tplUsdTwd = 'v31.3v'
const tplTwd = 'v158v'
const tplCode = 'vCODEv'
const tplPassword = 'vPASSWORDv'
const tplCodeTitle1 = 'vCODETITLE1v'
const tplCodeTitle2 = 'vCODETITLE2v'
const tplAddress1Url = 'vADDR1URLv'
const tplAddress2Url = 'vADDR2URLv'

const tplSvg = 'Book1984Front.svg'
const tplSvgBack = 'Book1984Back.svg'

var svgFile = bookId.ver + '/' + bookId.ver + '-Front.svg'
var svgFileBack = bookId.ver + '/' + bookId.ver + '-Back.svg'

var date = moment().format('YYYY-MM-DD')
console.log(date)

function getCode(seedStr, wordsize, _opt) {
    // 12,15,18,21,24=128~256
    var wsize = wordsize || 12
    var opt = _opt || {}
    var network = opt.network || Networks.testnet
    var wordlist = Mnemonic.Words.CHINESE_TRADITIONAL
    var buf = new bitcorelib.deps.Buffer(seedStr)
    var buf256 = bitcorelib.crypto.Hash.sha256(buf)
    var entSize = wsize * 4 / 3
    var bufEnt = buf256.slice(0, entSize)
    var code = new Mnemonic(bufEnt, wordlist)
    var xpriv = code.toHDPrivateKey(opt.password, network)
    return {
        opt: opt,
        xpriv: xpriv,
        seed: seedStr,
        code: code.toString()
    }
}


function getPrice(cb) {
    var url = 'https://api.coindesk.com/v1/bpi/currentprice/TWD.json'
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body)
            var bpi = body.bpi
            var btcusd = bpi.USD.rate_float
            var btctwd = bpi.TWD.rate_float
            var usdtwd = btctwd / btcusd
                // float_num.toFixed(2);
            var r = {
                raw: body,
                btcusd: Math.round(btcusd),
                btctwd: Math.round(btctwd),
                usdtwd: Math.round(usdtwd * 100) / 100
            }
            cb(null, r)
        } else {
            cb(error)
        }
    })
}


function getDeriveKeys(mcode, account, channel, kid, _opt) {
    var opt = _opt || {}
    var network = opt.network || Networks.testnet
    var mspace = (mcode.match(/\s/g) || []).length
    if (mspace < 11 || mspace > 23) {
        return {
            error: 'mcode error',
            mcode: mcode
        }
    }
    var wordlist = Mnemonic.Words.CHINESE_TRADITIONAL
    var code = new Mnemonic(mcode, wordlist)
    var xpriv = code.toHDPrivateKey(opt.password, network)
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


function createKeys() {

    var password = bookId.password
    var seed = bookId.seed

    var optTest = {
        network: Networks.testnet,
        password: password
    }

    var optMain = {
        network: Networks.mainnet,
        password: password
    }

    var rcode = getCode(seed, 24, optMain)

    //console.log(rcodeMain)
    //console.log(rcodeTest)
    var rkeyMain = getDeriveKeys(rcode.code, 1, 1984, 1, optMain)
    var rkeyTest = getDeriveKeys(rcode.code, 2, 1984, 1, optTest)

    //console.log(rkeyMain)
    //console.log(rkeyTest)

    return {
        password: password,
        main: {
            address: rkeyMain.address,
            wif: rkeyMain.wif,
            code: rkeyMain.mcode,
            title: rkeyMain.ktitle
        },
        test: {
            address: rkeyTest.address,
            wif: rkeyTest.wif,
            code: rkeyTest.mcode,
            title: rkeyTest.ktitle
        }
    }
}

function replaceSvgFile(keys) {
    var address1 = keys.main.address
    var address2 = keys.test.address

    mkdir(bookId.ver)
    cp(tplSvg, svgFile)
    cp(tplSvgBack, svgFileBack)

    sed('-i', tplAddr1, address1, svgFile)
    sed('-i', tplAddr2, address2, svgFile)
    sed('-i', tplVersion, bookId.ver, svgFile)
    sed('-i', tplPrintedDate, bookId.printedDate, svgFile)
    sed('-i', tplDate, date, svgFile)

    var code = keys.main.code
    var prefix = 'https://y12ji.com/book/#/f?v=' + bookId.ver + '&a='
    var addr1url = prefix + address1
    var addr2url = prefix + address2

    sed('-i', tplCode, code, svgFile)
    sed('-i', tplAddress1Url, _.escape(addr1url), svgFile)
    sed('-i', tplAddress2Url, _.escape(addr2url), svgFile)

    // price tag
    getPrice(function(err, res) {
            var btcUsd = res.btcusd
            var btcTwd = res.btctwd
            var usdTwd = res.usdtwd
            var twd = Math.round(res.btctwd * bookId.btc)
            sed('-i', tplBtc, bookId.btc, svgFile)
            sed('-i', tplBtcUsd, btcUsd, svgFile)
            sed('-i', tplBtcTwd, btcTwd, svgFile)
            sed('-i', tplUsdTwd, usdTwd, svgFile)
            sed('-i', tplTwd, twd, svgFile)

        })
        // back

    var wif1 = keys.main.wif
    var wif2 = keys.test.wif
    var password = keys.password
    var codetitle1 = keys.main.title
    var codetitle2 = keys.test.title
    sed('-i', tplWif1, wif1, svgFileBack)
    sed('-i', tplWif2, wif2, svgFileBack)
    sed('-i', tplVersion, bookId.ver, svgFileBack)
    sed('-i', tplCode, code, svgFileBack)
    sed('-i', tplPassword, password, svgFileBack)
    sed('-i', tplCodeTitle1, codetitle1, svgFileBack)
    sed('-i', tplCodeTitle2, codetitle2, svgFileBack)

    var prefixBack = 'https://y12ji.com/book/#/b?v=' + bookId.ver + '&k='
    var wif1url = prefixBack + wif1
    var wif2url = prefixBack + wif2

    qrsave(address1, 'qraddr1.png')
    qrsave(address2, 'qraddr2.png')
    qrsave(addr1url, 'qraddrurl1.png')
    qrsave(addr2url, 'qraddrurl2.png')
    qrsave(wif1, 'qrwif1.png')
    qrsave(wif2, 'qrwif2.png')
    qrsave(wif1url, 'qrwifurl1.png')
    qrsave(wif2url, 'qrwifurl2.png')
    qrsave('https://y12ji.com/book/', 'qry12ji.png')
}

function qrsave(txt, file) {
    // size 740x740
    var options = {
        'box_size': '20'
    }
    qr_cairo.save(txt, bookId.ver + '/' + file, options)
}


function main() {
    var keys = createKeys()
    console.log(keys)
    replaceSvgFile(keys)
}

main()
