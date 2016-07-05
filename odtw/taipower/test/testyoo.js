var Yoo = require('../yoo')
var yoo = new Yoo()
var chokidar = require('chokidar')
var assert = require('chai').assert

beforeEach(function() {
    //before testing
});
afterEach(function() {
    //after testing
});

describe('FileHeadStream', function() {

    it('weightAvgTest', function() {
        // 23 = Math.round(60 * (60 / 160))
        // 37 = 60 -23
        assert.deepEqual([23, 37, 67, 53, 80, 90], Yoo.weightAvg([60, 0, 100, 20, 80, 90], 50))
        assert.deepEqual([8, 23, 37, 67, 53, 80, 90], Yoo.weightAvg([8, 60, 0, 100, 20, 80, 90], 50))
    })

    it('avgTest', function() {
        assert.deepEqual([50, 50, 51, 50, 101], Yoo.avg([100, 0, 100, 1, 101], 50))
        assert.deepEqual([100, 80, 51, 50, 101], Yoo.avg([100, 80, 100, 1, 101], 50))
        assert.deepEqual([90, 90, 51, 50, 101], Yoo.avg([100, 80, 100, 1, 101], 15))
        assert.deepEqual([13, 50, 50, 65, 65, 45], Yoo.avg([13, 90, 10, 100, 30, 45], 50))
    })

    it('convertTest', function(done) {
        var destCsvPath = 'out1.test.csv'
        var srcCsvPath = 'records-160704.csv'
        yoo.convertCsv(srcCsvPath,destCsvPath,6, Yoo.weightAvg)
        chokidar.watch(destCsvPath).on('change', function(event, path) {
            var objs = yoo.getCsvObjecsByPath(destCsvPath, function(err, res) {
                // console.log(res)
                assert.isArray(res)
                assert.equal(5, res.length)
                assert.equal('下罟里', res[0].village)
                assert.equal('八里區', res[0].area)
                assert.notEqual('527831', res[0]['201603'])
                done()
            })
        })
    })
})
