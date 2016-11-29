var app = require('../app')
var assert = require('chai').assert
var yapp = app.yapp
var _ = app._
var stringify = app.stringify
var bitcorelib = app.bitcorelib

var blockCertsSample = require('./sample_signed_cert-1.2.json')

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

describe('App', function() {
    describe('app', function() {
        it('foo', function() {
            assert.equal('foo', yapp.foo('foo'))
        })
        it('buildProof', function() {
            var r1 = yapp.newReceipt()
            var r2 = yapp.newReceipt()
            var r3 = yapp.newReceipt()
            r1.targetHash = 'fd3f0550fd1164f463d3e57b7bb6834872ada68501102cec6ce93cdbe7a17404'
            r2.targetHash = '7c9dfce9ca4684321e4851ce263ac730652d1897e5041196ffe989790317679c'
            r3.targetHash = 'cb4c46e8ebbc1d646f07a8ff00561a92c83cc1f40ea27d85b1e90c3f858b3815'
            var rarr = yapp.buildProof([r1, r2, r3])
            console.log(JSON.stringify(rarr, null, 4))
        })


        it('sha256', function() {
            var hash = yapp.sha256('hello world')
            assert.equal('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', hash)
        })

        it('buildProof', function(done) {
            this.timeout(5000)
            var r1 = yapp.newReceipt()
            yapp.normalize(r1, function(err, res) {
                //console.log(res)
                //console.log(typeof res)
                assert.isString(res)
                done()
            })
        })

        it('buildCpTargetHash', function(done) {
            this.timeout(5000)
            var bc = blockCertsSample
            yapp.buildCpTargetHash(bc, function(err, res) {
                console.log(res)
                    //console.log(typeof res)
                assert.isString(res)
                assert.equal(bc.receipt.targetHash, res)
                done()
            })
        })

        it('sign blockcerts', function() {
            // https://github.com/bitcoin/bitcoin/blob/master/qa/rpc-tests/signmessages.py
            var wif = 'cUeKHd5orzT3mz8P9pxyREHfsWtVfgsfDjiZZBcjUBAaGk1BTj7N'
            var address = 'mpLQjfK79b7CCV4VMJWEWAj5Mpx8Up5zxB'
            var msg = 'This is just a test message'
            var sign = yapp.sign(wif, msg)
            console.log(sign)
            assert.isString(sign)
            assert.isOk(yapp.verify(address, sign, msg))
        })


        it('newBlockcert', function() {
            var bc1 = yapp.newBlockcert()
            var bc2 = yapp.newBlockcert()
            assert.isTrue(bc1 != bc2)
            var assertion1 = bc1.document.assertion
            var assertion2 = bc2.document.assertion
            console.log(assertion1, assertion2)
            assert.notEqual(assertion1.uid,assertion2.uid)
        })

    })
})
