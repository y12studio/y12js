// ------------------
// -- bitcoind rpc
// https://github.com/bitpay/bitcoind-rpc
var bitcore = require('bitcore');
var RpcClient = require('bitcoind-rpc');
var math = require('mathjs');
var request = require('request');
var format = require('string-format');

function reqdb(body) {
    request({
        uri: 'http://influx:8086/write?db=db1',
        method: 'POST',
        body: body
    }, function(err, res, body) {
        if (err) console.log(err)
        console.log(body)
    });
}

function push2influxdb(tx) {
    console.log('push2influxdb : ' + JSON.stringify(tx, null, 2));
    var txbody = format('tx,version={version},txid={txid} vin={vin.length},vout={vout.length}', tx);
    console.log('push2influxdb : ' + txbody);
    reqdb(txbody);

    tx.vout.forEach(function(v, index, array) {
        // console.log('address=' + v.scriptPubKey.addresses[0]);
        var address = v.scriptPubKey.addresses[0];
        var voutbody = format('vout,txid={0.txid},address={2} value={1.value},n={1.n}', tx, v , address);
        console.log('vout:' + voutbody);
        reqdb(voutbody);
    });
}

var BRpc = function() {

    var config = {
        protocol: 'http',
        user: process.env.Y_KEEPER_USER,
        pass: process.env.Y_KEEPER_PASS,
        host: process.env.Y_KEEPER_HOST,
        port: process.env.Y_KEEPER_PORT,
    };

    var rpc = new RpcClient(config);

    var lastblockcount = 0;

    this.getVar = function() {
        return {
            lastblockcount: lastblockcount
        };
    }

    this.setGenerate = function(num) {
        // setgenerate true num
        rpc.setGenerate(true, num, function(error, r) {
            console.log('generate: ' + JSON.stringify(r.result));
        });
    };

    this.getNewAddress = function() {
        rpc.getNewAddress(function(error, parsedBuf) {
            console.log('address=' + parsedBuf['result']);
        });
    };

    this.checkblock = function() {
        console.log('checkblock with lastblockcount=' + lastblockcount);
        rpc.getBlockCount(function(error, r) {
            if (r.result > lastblockcount) {
                console.log('getBlockCount=' + r.result);
                // Returns hash of block in best-block-chain at <index>; index 0 is the genesis block
                rpc.getBlockHash(r.result, function(error, br) {
                    console.log('getBlockHash:' + JSON.stringify(br));
                    lastblockcount = r.result;
                    rpc.getBlock(br.result, function(error, bh) {
                        console.log('getBlock:' + JSON.stringify(bh.result));
                        bh.result.tx.forEach(function(txid, index, array) {
                            console.log('getBlock tx:' + txid);
                            rpc.getRawTransaction(txid, function(error, tr) {
                                txhex = tr.result;
                                // console.log('txhex=' + txhex);
                                rpc.decodeRawTransaction(txhex, function(error, dt) {
                                    // console.log(JSON.stringify(dt.result));
                                    if (dt.result) {
                                        push2influxdb(dt.result);
                                    }
                                });
                            });
                        });
                    });
                });
            }
        });
    };

    this.sendToLocalNewAddress = function(amount) {
        //  alice sendtoaddress $(alice getnewaddress) 199
        rpc.getNewAddress(function(error, parsedBuf) {
            var addr = parsedBuf['result'];
            console.log('address=' + parsedBuf['result']);
            rpc.sendToAddress(addr, amount, function(error, parsedBuf) {
                console.log(parsedBuf);
            });
        });
    };

    this.sendToAddress = function(addr, amount) {
        // setgenerate true num
        rpc.sendtoAddress(addr, amount, function(error, parsedBuf) {
            console.log(parsedBuf);
        });
    };
};

var CronEmitter = require("cron-emitter").CronEmitter;

var emitter = new CronEmitter();
var now = new Date();
var brpc = new BRpc();


setTimeout(function() {
    // first 99 blocks
    if (brpc.getVar().lastblockcount < 10) {
        brpc.setGenerate(99);
    }
}, 8000);

emitter.add("*/4 * * * * *", "mocktx");

emitter.add("*/10 * * * * *", "generateblock");

emitter.add("*/5 * * * * *", "checkblock");

emitter.on("mocktx", function() {
    "use strict";
    console.log('mocktx blockcount=' + brpc.getVar().lastblockcount);
    if (brpc.getVar().lastblockcount > 101) {
        brpc.sendToLocalNewAddress(math.pickRandom([1.2, 1.5, 0.3, 0.7, 2.5, 0.6]));
    }
});

emitter.on("generateblock", function() {
    "use strict";
    brpc.setGenerate(1);
});

emitter.on("checkblock", function() {
    "use strict";
    brpc.checkblock();
});
