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

Yoo.prototype.transformCsvStream = function(stream, outputPath, funcTrans) {
    var count = 0
    csv.fromStream(stream, {
            headers: false
        }).transform(function(record) {
            return funcTrans(count++, record)
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

Yoo.prototype.convertCsv = function(srcCsvPath,destCsvPath, headLines, funcAvg){
    var stream = this.getFileHeadStream(srcCsvPath, headLines)
    this.transformCsvStream(stream, destCsvPath, function(rowIndex, data) {
        var r =  rowIndex > 0 ? Yoo.mapAvg(data, 4, funcAvg) : data
        //console.log('TRANS', rowIndex, r)
        return r
    })
}

Yoo.mapAvg = function(data, startCols, avgFunc) {
    var arrInt = _.map(_.drop(data, startCols), function(v) {
        return _.toInteger(v)
    })
    var arrAvg = _.isNull(avgFunc) ? arrInt : avgFunc(arrInt, 50)
    return _.concat(_.take(data, startCols), arrAvg)
}

Yoo.weightAvg = function(arr, percent) {
    var r = []
    var len = arr.length
    for (var i = 0; i < len; i++) {
        var v = arr[i]
        var prev = 0,
            diff = 0,
            next = 0

        if (i > 0 && i < len - 1) {
            prev = arr[i - 1]
            next = arr[i + 1]
            diff = v - prev
            if (diff < 0 && Math.abs(diff) / v * 100 > percent) {
                var total = prev + v
                var weightPrev = prev + next
                var pr = Math.round(prev / weightPrev * total)
                var vr = total - pr
                r.push(vr)
                r[i - 1] = pr
                    // console.log(vr, pr, diff , r)
            } else {
                r.push(v)
            }
        } else {
            r.push(arr[i])
        }
    }
    return r
}

Yoo.avg = function(arr, percent) {
    var r = []
    for (var i = 0; i < arr.length; i++) {
        var v = arr[i]
        var prev = 0
        var diff = 0
        if (i > 0) {
            prev = arr[i - 1]
            diff = v - prev
            if (diff < 0 && Math.abs(diff) / v * 100 > percent) {
                var total = v + prev
                var pr = Math.round(total / 2)
                var vr = total - pr
                r.push(vr)
                r[i - 1] = pr
                    // console.log(vr, pr, diff , r)
            } else {
                r.push(v)
            }
        } else {
            r.push(arr[i])
        }
    }
    return r
}

module.exports = Yoo
