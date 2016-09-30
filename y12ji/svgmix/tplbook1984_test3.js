var qr_cairo = require('qr-cairo')
require('shelljs/global')
const tplAddr1 = 'm1ESjLZW66TmHhiFX'
const tplAddr12 = '81CaBjrhZ543PPh9a'
const tplAddr2 = 'm2ESjLZW66TmHhiFX'
const tplAddr22 = '82CaBjrhZ543PPh9a'

var addr1 = 'x1ESjLZW66TmHhiFX'
var addr12 = 'z1MCaBjrhZ543PPh9a'
var addr2 = 'x2ESjLZW66TmHhiFX'
var addr22 = 'z2MCaBjrhZ543PPh9a'

sed('-i', tplAddr1, addr1, 'Book1984Front.svg')
sed('-i', tplAddr12, addr12, 'Book1984Front.svg')
sed('-i', tplAddr2, addr2, 'Book1984Front.svg')
sed('-i', tplAddr22, addr22, 'Book1984Front.svg')

var options = {'box_size': '20'}
// size 740x740
qr_cairo.save(addr1+addr12, 'qraddr1.png', options)
qr_cairo.save(addr2+addr22, 'qraddr2.png', options)
