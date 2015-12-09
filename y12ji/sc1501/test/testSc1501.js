var sc1501 = require('../app')
var assert = require('chai').assert
var scard = sc1501.scard
var bip39 = sc1501.bip39
var secrets = sc1501.secrets

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('SC1501', function() {

    describe('scard', function() {
        it('split', function() {
            var rs = scard.split('1234HelloWorld...He',7,4)
            console.log(rs)
            assert.equal(7,rs.share)
            assert.equal(7,rs.shares.length)
            var rm = rs.mshares
            var rc = scard.combine([rm[0],rm[2],rm[4],rm[5]])
            console.log(rc)
            assert.equal(rs.keyhex, rc.keyhex)
            assert.equal(rs.wif, rc.wif)
        })
    })

    describe('bitcorelib', function() {
        it('scard wrap', function() {
            var hex256 = secrets.random(256)
            assert.isString(hex256)
            assert.equal(64, hex256.length)
        })
    })

    describe('secrets', function() {
        it('scard wrap', function() {
            var mnemonic = bip39.entropyToMnemonic('133755ff') // hex input, defaults to BIP39 English word list
                // 'basket rival lemon'
            assert.ok((/^\w+ \w+ \w+$/).test(mnemonic))
            assert.equal('basket rival lemon',mnemonic)

            var temp = bip39.mnemonicToEntropy(mnemonic) // hex input, defaults to BIP39 English word list
                // '133755ff'
            assert.equal(temp, '133755ff')
        })
    })
})
