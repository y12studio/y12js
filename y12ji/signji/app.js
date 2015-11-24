var hckeyjson = require('./hc1501key.json');
var bip38 = require('bip38');
var bitcorelib = require('bitcore-lib');
var bitcoremnemonic = require('bitcore-mnemonic');
var HDPrivateKey = bitcorelib.HDPrivateKey;
var hckey = new HDPrivateKey(hckeyjson.hdkey);
console.log(hckey);

function dkey(pkey, account, channel, id) {
    var dkey = pkey.derive(account, true).derive(channel).derive(id);
    var key = dkey.privateKey;
    return {
        title:'m/'+account+'h/'+channel+"/"+id,
        raw: dkey,
        wif: key.toWIF(),
        address: key.toAddress().toString()
    };
}

// m/1h/0/1
// ar derivedByNumber = hdPrivateKey.derive(1).derive(2, true);
for (var i = 0; i < 10; i++) {
    console.log(dkey(hckey,1,0,i));
}

// bitcore-lib/hash.js at master · bitpay/bitcore-lib
// https://github.com/bitpay/bitcore-lib/blob/master/lib/crypto/hash.js
// file2buffer?
