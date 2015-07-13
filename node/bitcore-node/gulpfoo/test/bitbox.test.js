var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('Test Bitbox', function() {
    it('expect to equal', function() {
        var Bitbox = require('../bitbox');
        // static method
        var addr1 = Bitbox.saddr();
        console.log(addr1);

        var bo = new Bitbox();
        // instance method
        var addr2 = bo.addr();
        console.log(bo.toJSON());

        addr1.length.should.equal(34);
        addr2.length.should.equal(34);
        addr1.should.not.equal(addr2);
    });
});
