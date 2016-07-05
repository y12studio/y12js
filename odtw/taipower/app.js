var utils = require('./utils')
var csv = require('fast-csv')
var fs = require('fs')
var _ = require('lodash')

var inputPath = 'records-160704.csv'
var outputPath = 'out.csv'

var stream = utils.getFileHeadStream(inputPath, 30);
utils.transformCsvStream(stream, outputPath, function(rowIndex, data) {
    // console.log('TRANS', rowIndex, data)
    return rowIndex > 1 ? utils.convert(data, 4) : data
})
