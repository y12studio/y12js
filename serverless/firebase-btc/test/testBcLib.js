var chai = require('chai')
var assert = chai.assert
var BcLib = require('../bclib')

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('bclib Test', function() {
    it("rankey", function() {
        var r = BcLib.rankey()
        console.log(r)
        assert.isOk(r.key)
    })
})
