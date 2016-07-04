'use strict';
var fs = require('fs')
var _ = require('lodash');
var sutil = require('line-stream-util')
var csv = require('fast-csv')

function Yoo() {}

Yoo.prototype.getFileHeadStream = function(path, headLines) {
    return fs.createReadStream(path, 'utf8').pipe(sutil.head(headLines));
}

Yoo.prototype.transform = function(stream, outputPath, onTransform) {
    csv.fromStream(stream, {
            headers: false
        }).transform(onTransform).pipe(csv.createWriteStream({
            headers: true
        }))
        .pipe(fs.createWriteStream(outputPath, {
            encoding: "utf8"
        }));


}

Yoo.prototype.convert = function(data, startCols) {
    var mapo = _.map(_.drop(data, startCols), function(v) {
        return _.toInteger(v) + 1
    })
    return _.concat(_.take(data, startCols), mapo)
}
module.exports = new Yoo()
