var utils = require('./utils')
var csv = require('fast-csv')
var fs = require('fs')
var _ = require('lodash')

var count = 0

var stream = utils.getFileHeadStream('records-160704.csv', 8);
utils.transform(stream, 'out.csv', function(data) {
    var r = data
    if (data[0] != 'code') {
        r = utils.convert(data, 4)
    }
    console.log('TRANS', count++, r)
    return r
})
