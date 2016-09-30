var qr_cairo = require('qr-cairo')
require('shelljs/global')
const tplAddr1 = 'm1ESjLZW66TmHhiFX8MCaBjrhZ543PPh9a'
const tplAddr2 = 'm2ESjLZW66TmHhiFX8MCaBjrhZ543PPh9a'

var addr1 = 'x1ESjLZW66TmHhiFX8MCaBjrhZ543PPh9a'
var addr2 = 'x2ESjLZW66TmHhiFX8MCaBjrhZ543PPh9a'

sed('-i', tplAddr1, addr1, 'Book1984Front.svg')
sed('-i', tplAddr2, addr2, 'Book1984Front.svg')

var options = {'box_size': '20'}
// size 740x740
qr_cairo.save(addr1, 'qraddr1.png', options)
qr_cairo.save(addr2, 'qraddr2.png', options)
