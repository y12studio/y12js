fs = require('fs')

// qr-image  https://www.npmjs.com/package/qr-image
var qr = require('qr-image');

var qr_svg = qr.image('6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', { type: 'svg' });
qr_svg.pipe(require('fs').createWriteStream('qrimg_demo1.svg'));
