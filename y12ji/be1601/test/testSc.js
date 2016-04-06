var sc = require('../app')
var assert = require('chai').assert
var scard = sc.scard
var bitcorelib = sc.bitcorelib
var Script = bitcorelib.Script
var Message = sc.Message
var ethutil = sc.ethutil
var PrivateKey = bitcorelib.PrivateKey;
var PublicKey = bitcorelib.PublicKey;
var Address = bitcorelib.Address;
var echash = new Buffer('82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28', 'hex')
var ecprivkey = new Buffer('3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1', 'hex')

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('BE1601', function() {
    describe('scard', function() {
        it('build', function() {
            var tr = scard.getFoo('Hello')
            console.log(tr)
            assert.equal('Foo-Hello',tr)
            assert.equal(ethutil.sha3(new Buffer('Hello Y12JI')).toString('hex'), '743d8887c0d7e3e145ae60412fc72ca05357f341242e7ed6af4144cd59c8d3c4')

            var prefix = 'Y12JI'
            var value = '98766'
            var ecprivkey = ethutil.sha3(new Buffer('ETH PRIVATE KEY'));
            var addr1 = ethutil.privateToAddress(ecprivkey).toString('hex')

            var echash = ethutil.sha3(new Buffer(prefix+':'+value))

            var sr = ethutil.ecsign(echash,ecprivkey)
            console.log(sr)
            // vrs
            var ecpubkey = ethutil.ecrecover(echash,sr.v, sr.r,sr.s)
            var addr2 = ethutil.publicToAddress(ecpubkey).toString('hex')
            assert.equal(addr1,addr2)

            var privateKey = PrivateKey.fromWIF('cPBn5A4ikZvBTQ8D7NnvHZYCAxzDZ5Z2TSGW2LkyPiLxqYaJPBW4');
            var address = privateKey.toAddress()

            var xsign = scard.signBtcMsg('hello, world',privateKey)
            console.log(xsign)
            var pubkeyFromSign = scard.recoverEcdsaPubKey('hello, world', xsign.raw)
            var addressFromSign = Address.fromPublicKey(pubkeyFromSign, address.network)

            console.log(pubkeyFromSign)
            assert.equal(address.toString(),addressFromSign.toString())
            var verified = Message('hello, world').verify(address, xsign.base64);
            assert.isTrue(verified);
        })
    })
})
