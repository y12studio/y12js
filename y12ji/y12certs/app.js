var bitcorelib = require('bitcore-lib')
var _ = require('lodash')
var stringify = require('json-stable-stringify')
var merkletools = require('merkle-tools')

function yapp() {}

yapp.cptemplate = {
    "@context": "https://w3id.org/chainpoint/v2",
    "type": "ChainpointSHA256v2",
    "targetHash": "bdf8c9bdf076d6aff0292a1c9448691d2ae283f2ce41b045355e2c8cb8e85ef2",
    "merkleRoot": "",
    "proof": [],
    "anchors": [{
        "type": "BTCOpReturn",
        "sourceId": ""
    }]
}

yapp.newReceipt = function() {
    return _.cloneDeep(yapp.cptemplate)
}

yapp.buildProof = function(cparray) {
    var merkleTools = new merkletools()
    cparray.forEach(function(r) {
        merkleTools.addLeaf(r.targetHash)
    })
    merkleTools.makeTree()
    var rootValue = merkleTools.getMerkleRoot().toString('Hex')
    // console.log(rootValue.toString('Hex'))
    cparray.forEach(function(e,i,a){
        var proof = merkleTools.getProof(i)
        e.proof = proof
        e.merkleRoot = rootValue
    })
    return cparray
}

yapp.foo = function(t) {
    return t
}

module.exports = {
    bitcorelib: bitcorelib,
    _: _,
    stringify: stringify,
    yapp: yapp
}
