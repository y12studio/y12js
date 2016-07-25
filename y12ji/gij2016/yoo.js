'use strict';
var _ = require('lodash')
var bitcorelib = require('bitcore-lib')

function Yoo() {}

Yoo.getAddress = function(prefix,charTail){
    var padded = prefix + Array(34 + 1 - prefix.length).join(charTail);
    var hash160 = bitcorelib.encoding.Base58.decode(padded).slice(1, 21);
    var address = new bitcorelib.Address(hash160);
    console.log(padded, address)
    return address
}

Yoo.prototype.getFoo = function(num) {
    return num + 100
}

Yoo.foo = function(num) {
    return num + 200
}

module.exports = Yoo
