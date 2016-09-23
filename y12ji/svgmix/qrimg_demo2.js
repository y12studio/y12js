var qr_cairo = require('qr-cairo')
//  sudo apt-get install libcairo2-dev libqrencode-dev
//https://www.npmjs.com/package/qr-cairo
var options = {'box_size': '20'}
// size 740x740
qr_cairo.save('mkESjLZW66TmHhiFX8MCaBjrhZ543PPh9a', 'qrimg_demo2_1.png', options)
qr_cairo.save('cP3voGKJHVSrUsEdrj8HnrpwLNgNngrgijMyyyRowRo15ZattbHm', 'qrimg_demo2_2.png', options)
