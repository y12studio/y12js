var qr_cairo = require('qr-cairo')
var moment = require('moment')
require('shelljs/global')
const tplAddr1 = 'm1ESjLZW66TmHhiFX'
const tplAddr12 = '81CaBjrhZ543PPh9a'
const tplAddr2 = 'm2ESjLZW66TmHhiFX'
const tplAddr22 = '82CaBjrhZ543PPh9a'
const tplVersion = 'VvV'
const tplDate = 'y016-m9-d9'
const tplPrintedDate='y984'
const tplBtcUsd = 'v600v'
const tplBtcTwd = 'v16800v'
const tplUsdTwd = 'v31.3v'
const tplTwd = 'v158v'
var version = 'A01'
var printedDate = '1984'
var addr1 = 'x1ESjLZW66TmHhiFX'
var addr12 = 'z1MCaBjrhZ543PPh9a'
var addr2 = 'x2ESjLZW66TmHhiFX'
var addr22 = 'z2MCaBjrhZ543PPh9a'

var btcUsd = '589'
var btcTwd = '15989'
var usdTwd = '30.6'
var twd = '160'

var date = moment().format('YYYY-MM-DD')
console.log(date)
const tplSvg = 'Book1984Front.svg'
const svgFile = 'Book1984FrontR.svg'
cp(tplSvg, svgFile)
sed('-i', tplAddr1, addr1, svgFile)
sed('-i', tplAddr12, addr12, svgFile)
sed('-i', tplAddr2, addr2, svgFile)
sed('-i', tplAddr22, addr22, svgFile)
sed('-i', tplVersion, version, svgFile)
sed('-i', tplPrintedDate, printedDate, svgFile)
sed('-i', tplDate, date, svgFile)
sed('-i', tplBtcUsd, btcUsd, svgFile)
sed('-i', tplBtcTwd, btcTwd, svgFile)
sed('-i', tplUsdTwd, usdTwd, svgFile)
sed('-i', tplTwd, twd, svgFile)

var options = {'box_size': '20'}
// size 740x740
qr_cairo.save(addr1+addr12, 'qraddr1.png', options)
qr_cairo.save(addr2+addr22, 'qraddr2.png', options)
