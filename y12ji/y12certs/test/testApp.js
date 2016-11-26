var app = require('../app')
var assert = require('chai').assert
var yapp = app.yapp
var _ = app._
var stringify = app.stringify
var bitcorelib = app.bitcorelib

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
            var rarr = yapp.buildProof([r1,r2,r3])
            console.log(JSON.stringify(rarr, null, 4))
            //assert.equal('foo', yapp.foo('foo'))
        })
    })
})
