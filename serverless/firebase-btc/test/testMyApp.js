var chai = require('chai')
var assert = chai.assert
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
var MyApp = require('../myapp')
var testTWD = require('./testTWD')
var TEST_REMOTE = true

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('hello Test', function() {
    it("hello", function() {
        var r = MyApp.hello()
        assert.equal(r, 'hello world')
    })
})

describe('format twd output', function() {
    this.timeout(8000);
    it("formTWD", function() {
        var r = MyApp.formatTwd(testTWD)
            // console.log(r)
        assert.equal(r.btcusd, 806)
        assert.equal(r.btctwd, 25824)
        assert.equal(r.usdtwd, 32.03)
    })

    it("validateParams", function() {
        assert.becomes(MyApp.validateParams({
            twd: '1989',
            foo: 'YES'
        }), {
            twd: 1989,
            foo: 'YES'
        })

        assert.becomes(MyApp.validateParams({
        }), {
            twd: MyApp.ValidationSchema.twd.default,
            foo: MyApp.ValidationSchema.foo.default
        })

        assert.isRejected(MyApp.validateParams({
            twd: '1x989x'
        }))

        assert.isRejected(MyApp.validateParams({
            haha: 'TAICHUNG'
        }))

    })

    it("process", function(done) {
        if (TEST_REMOTE) {
            var myapp = new MyApp()
            myapp.process({twd:19999}).then(function(res){
                console.log(res)
                done()
            })
        }
    })

})
