"use strict"
var bitcore = require('bitcore-lib')
var Buffer = bitcore.deps.Buffer
var explorers = require('bitcore-explorers')
var insight = new explorers.Insight()
var Transaction = bitcore.Transaction
var UnspentOutput = bitcore.Transaction.UnspentOutput

class OPRTURN {

    bout(tx, callback) {
        insight.broadcast(tx, function(err, returnedTxId) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, returnedTxId)
            }
        });
    }

    postHandleTx(t) {
        var inputamount = 0
        var outputamount = 0
        t.inputs.forEach(function(e, i, a) {
            inputamount += e.output.satoshis
        })
        t.outputs.forEach(function(e, i, a) {
                outputamount += e.satoshis
            })
            // console.log(t.toJSON())
        var fee = inputamount - outputamount
        var size = t.toBuffer().length
        return {
            verify: t.verify(),
            inputamount: inputamount,
            outputamount: outputamount,
            size: size,
            fee: fee,
            feekb: Math.round(fee / size * 1000),
            hex: t.serialize(true),
            json: t.toJSON()
        }
    }

    utxoConvert() {
        // https://api.blockcypher.com/v1/btc/main/addrs/1NvErPi3tRRvR7A3unjVKwga1ZCx9CX9kL?unspentOnly=true&includeScript=true
        // bcaddr.sample.api.json
        // convert utxo@blcokcypher to utxo@bitcore-lib ?
        var sampleData = {
            'txid': 'e42447187db5a29d6db161661e4bc66d61c3e499690fe5ea47f87b79ca573986',
            'vout': 1,
            'address': 'mgBCJAsvzgT2qNNeXsoECg2uPKrUsZ76up',
            'scriptPubKey': '76a914073b7eae2823efa349e3b9155b8a735526463a0f88ac',
            'amount': 0.01080000
        }
        // https://github.com/bitpay/bitcore-lib/blob/master/test/transaction/unspentoutput.js
        var utxo = new UnspentOutput(sampleData2)
    }

    sendOpReturn(opt, callback) {
        var self = this;
        // https://blockchain.info/decode-tx
        var inaddr = opt.pk.toAddress().toString()
        var outaddr = opt.addrChange
        insight.getUnspentUtxos(inaddr, function(err, utxos) {
            if (err) {
                // Handle errors...
                return callback(err, null)
            } else {
                // console.log(utxos);
                // utxo@bitcore-lib lack of the confirmations field.
                // utxo from other api service?
                var opBuf = new Buffer(opt.prefix + opt.hash, 'hex');
                //console.log(opBuf.length);

                var t = new Transaction()
                    .from(utxos)
                    .feePerKb(opt.feekb)
                    .change(outaddr)
                    .addData(opBuf) // Add OP_RETURN data
                    .sign(opt.pk)
                    // console.log(t.toBuffer().length)
                var r = self.postHandleTx(t)
                r.addr = {
                    input: inaddr,
                    output: outaddr
                }
                r.utxos = utxos

                if (opt.broadcast && r.inputamount > 0) {
                    self.bout(t, function(err, txid) {
                        if (err) {
                            return callback(err, null)
                        }
                        if (txid) {
                            r.txid = txid
                            return callback(null, r)
                        }
                    })
                } else {
                    return callback(null, r)
                }
                // bout
            }
        });
    }
}

function main() {
    var keyjson = require('./opreturntest.key.json')
    var opt = {
        pk: new bitcore.PrivateKey(keyjson.wif),
        addrChange: keyjson.cgaddress,
        prefix: keyjson.Y12JIHC1,
        hash: keyjson.sha256,
        feekb: 12000,
        broadcast: false
    }
    new OPRTURN().sendOpReturn(opt, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

if (require.main === module) {
    main()
}
