var PDFDocument = require('pdfkit')
fs = require('fs')
var qr = require('qr-image')
// https://www.npmjs.com/package/pixl-xml
var XML = require('pixl-xml')

var svgObj1 = qr.svgObject('1PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', { type: 'svg' });
var svgObj2 = qr.svgObject('2PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', { type: 'svg' });

// https://github.com/svg/svgo
// $ svgo base_a4.svg base_a4.min.svg
var baseSvg = XML.parse('base_a4.min.svg')
// path[0] { d: 'M.965 1.23h97.83v77.443H.964z', fill: '#f9f9f9' }
console.log(baseSvg.path);

doc = new PDFDocument({
    size: 'A4',
    margins: { // by default, all are 72
        top: 2,
        bottom: 2,
        left: 2,
        right: 2
    },
    layout: 'landscape',
    info: {
        Title: 'titleA',
        Author: 'authorA',
        Subject: 'subjectA',
        Keywords: 'pdf;javascript',
        CreationDate: '15/10/2016',
        ModDate: '15/10/2016'
    }
})
doc.pipe(fs.createWriteStream('demo3.pdf'))
doc.fontSize(25)
   .text('DEMO3 !', 100, 100)

doc.translate(100, 0).path(svgObj1.path).fill('non-zero')
doc.translate(200, 0).path(svgObj2.path).fill('non-zero')
doc.save()
doc.restore()
doc.translate(0, 0)
// write the base svg to doc
baseSvg.path.forEach(function(p, index, arr) {
        doc.path(p.d).scale(0.5).fill()
    })
doc.save()
doc.end()
