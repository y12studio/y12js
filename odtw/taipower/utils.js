'use strict';
var fs = require('fs')
var _ = require('lodash');
var sutil = require('line-stream-util')
var csv = require('fast-csv')

function Yoo() {}

Yoo.prototype.getFileHeadStream = function(path, headLines) {
    var s = fs.createReadStream(path, 'utf8')
    return headLines > 0 ? s.pipe(sutil.head(headLines)) : s
}

Yoo.prototype.transformCsvStream = function(stream, outputPath, onTransform) {
    var count = 0
    csv.fromStream(stream, {
            headers: false
        }).transform(function(record) {
            return onTransform(count++, record)
        }).pipe(csv.createWriteStream({
            headers: true
        }))
        .pipe(fs.createWriteStream(outputPath, {
            encoding: "utf8"
        }));
}

Yoo.prototype.getCsvObjecsByPath = function(path, onEnd) {
    var r = []
    csv
        .fromPath(path, {
            headers: true
        })
        .on("data", function(data) {
            r.push(data)
        })
        .on("end", function() {
            onEnd(null, r)
        })
}

Yoo.prototype.convert = function(data, startCols) {
    var mapo = _.map(_.drop(data, startCols), function(v) {
        return _.toInteger(v) + 1
    })
    return _.concat(_.take(data, startCols), mapo)
}
module.exports = new Yoo()
