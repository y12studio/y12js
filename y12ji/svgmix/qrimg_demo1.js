fs = require('fs')

// qr-image  https://www.npmjs.com/package/qr-image
var qr = require('qr-image');

var qr_svg = qr.image('6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', { type: 'svg' })
qr_svg.pipe(fs.createWriteStream('qrimg_demo1.svg'))
// size5 margin4 : 205px x 205px
// size10 margin4: 410px x 410px
// size10 margin1: 350x350
// size10 margin0: 330x330
// QR code with transparent background and specific color · Issue #21 · alexeyten/qr-image
// https://github.com/alexeyten/qr-image/issues/21
var qrPng = qr.image('6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', { type: 'png', size:10, margin:0 })
qrPng.pipe(fs.createWriteStream('qrimg_demo1.png'))
