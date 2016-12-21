var chai = require('chai')
//var chaiAsPromised = require("chai-as-promised")
var assert = chai.assert
//chai.use(chaiAsPromised)

var MyApp = require('../myapp')
var testTWD = require('./testTWD')
var myapp = new MyApp()

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('hello Test', function() {
    it("hello", function() {
        var r = myapp.hello()
        assert.equal(r, 'hello world')
    })
})

describe('format twd output', function() {
    this.timeout(5000);
    it("formTWD", function() {
        var r = MyApp.formatTwd(testTWD)
            // console.log(r)
        assert.equal(r.btcusd, 806)
        assert.equal(r.btctwd, 25824)
        assert.equal(r.usdtwd, 32.03)
    })

    it("buildResponse", function(done) {
        myapp.buildResponse().then(function(r) {
            console.log(r)
            assert.isString(r.body)
            done()
        })
    })

    // it("buildResponse2", function() {
    //     return assert.isFulfilled(myapp.buildResponse()).then(function(r) {
    //         console.log(r)
    //         assert.isString(r.body)
    //     })
    // })

})
