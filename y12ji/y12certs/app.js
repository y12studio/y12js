var bitcorelib = require('bitcore-lib')
var Message = require('bitcore-message')
var Hash = bitcorelib.crypto.Hash
var _ = require('lodash')
var stringify = require('json-stable-stringify')
var merkletools = require('merkle-tools')
var jsonld = require('jsonld')

// Generate a v4 UUID (random)
const uuidV4 = require('uuid/v4')


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

yapp.bctemplate = {
    "document": {
        "signature": "",
        "certificate": {
            "language": "en-US",
            "type": "Certificate",
            "image": "data:image/png;base64",
            "issuer": {
                "url": "http://www.blockcerts.org/mockissuer/",
                "type": "Issuer",
                "image": "data:image/png;base64,",
                "name": "Game of thrones issuer",
                "email": "fakeEmail@gamoeofthronesxyz.org",
                "id": "http://www.blockcerts.org/mockissuer/issuer/got-issuer.json"
            },
            "id": "http://certificates.gamoeofthronesxyz.org/criteria/2016/08/got.json",
            "description": "This certifies that the named character is an official Game of Thrones character.",
            "name": "Game of Thrones Character"
        },
        "recipient": {
            "publicKey": "mgCNaPM3TFhh8Yn6U6VcEM9jWLhQbizy1x",
            "revocationKey": "mhjWi9Y3VhjcPmg2hcdjWBFZFTHtKuWFL2",
            "hashed": false,
            "givenName": "Arya",
            "familyName": "Stark",
            "identity": "aryaxyz@starkxyz.com",
            "type": "email"
        },
        "type": "CertificateDocument",
        "@context": "https://w3id.org/blockcerts/v1",
        "verify": {
            "attribute-signed": "uid",
            "type": "ECDSA(secp256k1)",
            "signer": "https://y12ji.com/mockissuer/keys/bc1601_public_key.asc"
        },
        "assertion": {
            "image:signature": "data:image/png;base64,",
            "type": "Assertion",
            "uid": "f813349f-1385-487f-8d89-38a092411fa5",
            "id": "https://y12ji.com/f813349f-1385-487f-8d89-38a092411fa5",
            "issuedOn": "2016-09-29"
        }
    },
    "type": "BlockchainCertificate",
    "receipt": {},
    "@context": "https://w3id.org/blockcerts/v1"
}

yapp.newReceipt = function() {
    return _.cloneDeep(yapp.cptemplate)
}

yapp.newBlockcert = function() {
    var r =  _.cloneDeep(yapp.bctemplate)
    var uid =  uuidV4()
    var assertion = r.document.assertion
    assertion.uid = uid
    assertion.id = "https://y12ji.com/certs/"+uid
    return r
}

yapp.sign = function(wif, msg){
    var privateKey = bitcorelib.PrivateKey.fromWIF(wif)
    return Message(msg).sign(privateKey)
}

yapp.verify = function(address, signature, msg){
    return Message(msg).verify(address, signature);
}

yapp.sha256 = function(targetStr) {
    return Hash.sha256(Buffer.from(targetStr)).toString('hex')
}

yapp.buildCpTargetHash = function(bcObj, cb) {
    yapp.normalize(bcObj.document, function(err, res) {
        if (err) {
            cb(err)
        } else {
            var hash = yapp.sha256(res)
            cb(null, hash)
        }
    })
}

//
// normalize timeout 5000 ms
//
yapp.normalize = function(doc, cb) {
    jsonld.normalize(doc, {
        algorithm: 'URDNA2015',
        format: 'application/nquads'
    }, function(err, normalized) {
        if (err) {
            cb(err)
        } else {
            cb(null, normalized)
        }
    })
}

yapp.buildProof = function(cparray) {
    var merkleTools = new merkletools()
    cparray.forEach(function(r) {
        merkleTools.addLeaf(r.targetHash)
    })
    merkleTools.makeTree()
    var rootValue = merkleTools.getMerkleRoot().toString('Hex')
        // console.log(rootValue.toString('Hex'))
    cparray.forEach(function(e, i, a) {
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
    bitcoremessage:Message,
    _: _,
    jsonld: jsonld,
    stringify: stringify,
    yapp: yapp
}
