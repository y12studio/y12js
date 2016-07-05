var utils = require('../utils')
var chokidar = require('chokidar')
var assert = require('chai').assert

beforeEach(function() {
    //before testing
});
afterEach(function() {
    //after testing
});

describe('FileHeadStream', function() {
    it('convertTest', function(done) {
        var testpath = 'out1.test.csv'
        var stream = utils.getFileHeadStream('records-160704.csv', 6);
        utils.transformCsvStream(stream, testpath, function(rowIndex, data) {
            // console.log('TRANS', rowIndex, r)
            return rowIndex > 1 ? utils.convert(data, 4) : data
        })

        chokidar.watch(testpath).on('change', function(event, path) {
            var objs = utils.getCsvObjecsByPath(testpath, function(err, res) {
                console.log(res)
                assert.isArray(res)
                assert.equal(5, res.length)
                assert.equal('下罟里', res[0].village)
                assert.equal('八里區', res[0].area)
                assert.equal('527831', res[0]['201603'])
                done()
            })
        })
    })
})
