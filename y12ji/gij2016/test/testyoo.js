var Yoo = require('../yoo')
var yoo = new Yoo()
var chokidar = require('chokidar')
var chai = require('chai')
var assert = chai.assert
var expect = chai.expect

beforeEach(function() {
    //before testing
});
afterEach(function() {
    //after testing
});

describe('FooTest', function() {
    it('fooTest', function() {
        expect(yoo.getFoo(5)).to.equal(105)
        expect(Yoo.foo(5)).to.equal(205)
    })

    it('getAddressTest', function() {
        expect(Yoo.getAddress('1Ghost2o16o7o1','X').toString()).to.equal('1Ghost2o16o7o1XXXXXXXXXXXXXXSFWcmQ')
        expect(Yoo.getAddress('1Ghost2o16o715','Y').toString()).to.equal('1Ghost2o16o715YYYYYYYYYYYYYYYPTsAA')
        expect(Yoo.getAddress('1Ghost2o16o729','Z').toString()).to.equal('1Ghost2o16o729ZZZZZZZZZZZZZZZsH3Pp')
    })
})
