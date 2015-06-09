var LOCALTEST = true;

var am = angular.module('MyApp', ['ngMaterial', 'ngMessages']);


am.service('bcSrv', function() {
    var bitcore = require('bitcore');
    var ECIES = require('bitcore-ecies');
    var Networks = bitcore.Networks;
    var Transaction = bitcore.Transaction;
    var UnspentOutput = bitcore.Transaction.UnspentOutput;
    var Buffer = bitcore.deps.Buffer;
    // bitcoin/chainparams.cpp at master · bitcoin/bitcoin
    // https://github.com/bitcoin/bitcoin/blob/master/src/chainparams.cpp
    Networks.add({
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

    // Networks.defaultNetwork = Networks.get('regnet');

    this.getPrikey = function(passcode) {
        value = new Buffer(passcode);
        hash = bitcore.crypto.Hash.sha256(value);
        bn = bitcore.crypto.BN.fromBuffer(hash);
        pk = new bitcore.PrivateKey(bn);
        return pk;
    }

    this.getKeyInfo = function(passcode) {
        var prik = this.getPrikey(passcode);
        var pubk = prik.publicKey;
        // pubk = bitcore.PublicKey.fromString(pubStr);
        return {
            wif: prik.toWIF(),
            pub: pubk.toString(),
            addr: pubk.toAddress().toString()
        };
    }

    this.getCypher = function( wif, pubstr) {
        var prik = bitcore.PrivateKey.fromWIF(wif);
        var pubk = bitcore.PublicKey.fromString(pubstr);
        return new ECIES().privateKey(prik).publicKey(pubk);
    }


    this.encrypt = function(msg, wif, pubstr) {
        var cypher = this.getCypher(wif,pubstr);
        return cypher.encrypt(msg).toString('hex');
    }


    this.decrypt = function(encrypted, wif, pubstr) {
        var cypher = this.getCypher(wif,pubstr);
        var encBuf = new Buffer(encrypted, 'hex');
        var decrypted = cypher.decrypt(encBuf);
      return decrypted.toString();
    }
});


am.controller('AppCtrl', function($scope, $http, bcSrv) {

    $scope.alice = {
        passcode: 'Alice Taichung 1987',
        secret: 'Say hello to Bob:-)'
    }

    $scope.bob = {
        passcode: 'Bob Taichung 1999'
    }

    $scope.getKeys = function() {
        $scope.alice['key'] = bcSrv.getKeyInfo($scope.alice.passcode);
        $scope.bob['key'] = bcSrv.getKeyInfo($scope.bob.passcode);
    }

    $scope.encrypt = function() {
        $scope.alice['encrypt'] = bcSrv.encrypt($scope.alice.secret, $scope.alice.key.wif, $scope.bob.key.pub);
    }

    $scope.decrypt = function() {
        $scope.bob['decrypt'] = bcSrv.decrypt($scope.alice.encrypt, $scope.bob.key.wif, $scope.alice.key.pub);
    }

});
