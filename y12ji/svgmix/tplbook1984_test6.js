var _ = require('lodash')
var qr_cairo = require('qr-cairo')
var moment = require('moment')
var bitcorelib = require('bitcore-lib')
var Mnemonic = require('bitcore-mnemonic')
var ZH_TW_WORDLIST = require('./chinese_traditional.json')
Mnemonic.Words.CHINESE_TRADITIONAL = ZH_TW_WORDLIST
var Networks = bitcorelib.Networks

require('shelljs/global')
const tplAddr1 = 'm1ESjLZW66TmHhiFX81CaBjrhZ543PPh9a'
const tplAddr2 = 'm2ESjLZW66TmHhiFX81CaBjrhZ543PPh9a'
const tplVersion = 'VvV'
const tplDate = 'y016-m9-d9'
const tplPrintedDate = 'y984'
const tplBtcUsd = 'v600v'
const tplBtcTwd = 'v16800v'
const tplUsdTwd = 'v31.3v'
const tplTwd = 'v158v'
const tplCode = 'vCODEv'
const tplAddress1Url = 'vADDR1URLv'
const tplAddress2Url = 'vADDR2URLv'

const tplSvg = 'Book1984Front.svg'
const svgFile = 'Book1984FrontR.svg'

var version = 'A01'
var printedDate = '1984'

var btcUsd = '589'
var btcTwd = '15989'
var usdTwd = '30.6'
var twd = '160'

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

    var optTest ={
        network: Networks.testnet,
        password: 'PassY12JIBook'
    }

    var optMain = {
        network: Networks.mainnet,
        password: 'PassY12JIBook'
    }

    var rcode = getCode('HelloY12JIBookLive', 24, optMain)

    //console.log(rcodeMain)
    //console.log(rcodeTest)
    var rkeyMain = getDeriveKeys(rcode.code, 1, 1984, 1, optMain)
    var rkeyTest = getDeriveKeys(rcode.code, 2, 1984, 1, optTest)

    console.log(rkeyMain)
    console.log(rkeyTest)

    return {
        main:{address:rkeyMain.address, wif:rkeyMain.wif, code:rkeyMain.mcode, title : rkeyMain.ktitle},
        test:{address:rkeyTest.address, wif:rkeyTest.wif, code:rkeyTest.mcode, title : rkeyTest.ktitle}
    }
}

function sedUrl(tpl,url, file){
    // sed 's#http://www.find.com/page#http://www.replace.com/page#g' input_file
    sed('-i', 's|'+tpl+'|'+url+'|g', file)
}

function replaceSvgFile(keys) {
    var address1 =  keys.main.address
    var address2 =  keys.test.address

    cp(tplSvg, svgFile)
    sed('-i', tplAddr1, address1, svgFile)
    sed('-i', tplAddr2, address2, svgFile)
    sed('-i', tplVersion, version, svgFile)
    sed('-i', tplPrintedDate, printedDate, svgFile)
    sed('-i', tplDate, date, svgFile)
    sed('-i', tplBtcUsd, btcUsd, svgFile)
    sed('-i', tplBtcTwd, btcTwd, svgFile)
    sed('-i', tplUsdTwd, usdTwd, svgFile)
    sed('-i', tplTwd, twd, svgFile)

    var code = keys.main.code
    var prefix = 'https://y12ji.com/book/1984/#/m?id=A01&ad='
    var addr1url = prefix + address1
    var addr2url = prefix + address2

    sed('-i', tplCode, code, svgFile)
    sed('-i', tplAddress1Url, _.escape(addr1url), svgFile)
    sed('-i', tplAddress2Url, _.escape(addr2url), svgFile)

    var options = {
            'box_size': '20'
        }
        // size 740x740
    qr_cairo.save(address1, 'qraddr1.png', options)
    qr_cairo.save(address2, 'qraddr2.png', options)
    qr_cairo.save(addr1url, 'qraddrurl1.png', options)
    qr_cairo.save(addr2url, 'qraddrurl2.png', options)
}


function main() {
    var keys = createKeys()
    console.log(keys)
    replaceSvgFile(keys)
}

main()
