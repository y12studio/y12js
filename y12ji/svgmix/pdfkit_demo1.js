PDFDocument = require('pdfkit')
fs = require('fs')
doc = new PDFDocument({
    size: 'A4',
    margins: { // by default, all are 72
        top: 2,
        bottom: 2,
        left: 2,
        right: 2
    },
    layout: 'landscape', // can be 'landscape'
    info: {
        Title: 'titleA',
        Author: 'authorA', // the name of the author
        Subject: 'subjectA', // the subject of the document
        Keywords: 'pdf;javascript', // keywords associated with the document
        CreationDate: '15/10/2016', // the date the document was created (added automatically by PDFKit)
        ModDate: '15/10/2016' // the date the document was last modified
    }
})
doc.pipe(fs.createWriteStream('demo1.pdf'))
doc.fontSize(25)
   .text('Some text with an embedded font!', 100, 100)
   // Draw a triangle
doc.save()
   .moveTo(100, 150)
   .lineTo(100, 250)
   .lineTo(200, 250)
   .fill("#FF3300")

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
doc.scale(0.6)
   .translate(470, -380)
   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
   .fill('red', 'even-odd')
   .restore()
doc.end()
