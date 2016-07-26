'use strict';
var _ = require('lodash')
var bitcorelib = require('bitcore-lib')
var Networks = bitcorelib.Networks

function Yoo() {}

Yoo.getAddress = function(prefix,charTail){
    var net = _.startsWith(prefix,'m') || _.startsWith(prefix,'n') ? Networks.testnet : Networks.livenet
    var padded = prefix + Array(34 + 1 - prefix.length).join(charTail);
    var hash160 = bitcorelib.encoding.Base58.decode(padded).slice(1, 21);
    var address = new bitcorelib.Address(hash160, net);
    console.log(padded, hash160 , address)
    return address
}

Yoo.prototype.getFoo = function(num) {
    return num + 100
}

Yoo.foo = function(num) {
    return num + 200
}

module.exports = Yoo
