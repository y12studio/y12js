// https://github.com/bitpay/bitcore-node/blob/master/index.js

'use strict';

var BitcoreNode = require('./lib/node');
var BitcoreHTTP = require('./api/lib/http');
var bitcore = require('bitcore');
var Promise = require('bluebird');
Promise.longStackTraces();

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


if (require.main === module) {
  var config = require('config');
  var nodeConfig = config.get('BitcoreHTTP.BitcoreNode');
  var httpConfig = config.get('BitcoreHTTP');
  var network = nodeConfig.network;
  console.log('Starting bitcore-node-http', network, 'network');
  bitcore.Networks.defaultNetwork = bitcore.Networks.get(network);
  var node = BitcoreNode.create(nodeConfig);
  node.on('error', function(err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('Connection to bitcoind failed');
    } else {
      console.log('Error: ', err);
    }
  });
  var http = new BitcoreHTTP(node, httpConfig);
  http.start()
    .catch(function(err) {
      http.stop();
      throw err;
    });
}
