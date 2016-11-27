var _ = require('lodash')
var jsonld = require('jsonld')

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

yapp.foo = function(t) {
    return t
}

var doc1 = {
    "http://schema.org/name": "Manu Sporny",
    "http://schema.org/url": {
        "@id": "http://manu.sporny.org/"
    },
    "http://schema.org/image": {
        "@id": "http://manu.sporny.org/images/manu.png"
    }
};

var docp = {
    "@context": "http://schema.org/",
    "type": "Person",
    "name": "Jane Doe",
    "jobTitle": "Professor",
    "telephone": "(425) 123-4567"
}

yapp.normalize(doc1, function(err,res){
    console.log(res)
})

//
yapp.normalize(docp, function(err,res){
    console.log(res)
})

yapp.normalize(yapp.cptemplate, function(err,res){
    console.log(res)
})
