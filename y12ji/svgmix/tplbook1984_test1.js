var qr_cairo = require('qr-cairo')
require('shelljs/global')
const tplAddr = 'mkESjLZW66TmHhiFX8MCaBjrhZ543PPh9a'
const tplWif = 'cP3voGKJHVSrUsEdrj8HnrpwLNgNngrgijMyyyRowRo15ZattbHm'

var addr = 'xkESjLZW66TmHhiFX8MCaBjrhZ543PPh9a'
var wif = 'xP3voGKJHVSrUsEdrj8HnrpwLNgNngrgijMyyyRowRo15ZattbHm'

sed('-i', tplAddr, addr, 'Book1984Front.svg')
sed('-i', tplWif, wif, 'Book1984Front.svg')
//  sudo apt-get install libcairo2-dev libqrencode-dev
//https://www.npmjs.com/package/qr-cairo
var options = {'box_size': '20'}
// size 740x740
qr_cairo.save(addr, 'qr_address.png', options)
qr_cairo.save(wif, 'qr_wif.png', options)
