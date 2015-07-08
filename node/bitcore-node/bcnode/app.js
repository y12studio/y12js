var bitcore = require('bitcore');
// bitcoin/chainparams.cpp at master · bitcoin/bitcoin
// https://github.com/bitcoin/bitcoin/blob/master/src/chainparams.cpp
bitcore.Networks.add({
    name: 'regnet',
    alias: 'regnet',
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4,
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394,
    networkMagic: 0xfabfb5da,
    port: 18333,
    dnsSeeds: [],
});
