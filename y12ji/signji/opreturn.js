var keyjson = require('./opreturntest.key.json')
var bitcore = require('bitcore-lib');
var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();
var Transaction = bitcore.Transaction;
var privateKey = new bitcore.PrivateKey(keyjson.wif);
var toAddress = new bitcore.PrivateKey().toAddress();
var cgAddress = new bitcore.PrivateKey().toAddress();

// Transaction.FEE_PER_KB = 23098;

function bout(tx){
    insight.broadcast(tx, function(err, returnedTxId) {
        if (err) {
            // Handle errors...
            console.log(err);
        } else {
            // Mark the transaction as broadcasted
            console.log(returnedTxId);
        }
    });
}
// https://blockchain.info/decode-tx
insight.getUnspentUtxos(privateKey.toAddress().toString(), function(err, utxos) {
    if (err) {
        // Handle errors...
        console.log(err);
    } else {
        console.log(utxos);
        var transaction = new Transaction()
            .from(utxos)
            .to(toAddress,50000)  // Add an output with the given amount of satoshis
            .change(cgAddress)
            .addData('y12ji rocks') // Add OP_RETURN data
            .sign(privateKey);

        console.log(transaction.toJSON())
        // hex result
        hexresult = transaction.serialize(true)
        console.log(hexresult)
        console.log(hexresult.length)
        console.log(transaction.toBuffer().length)
        console.log('Fee:'+transaction.getFee())
        console.log(transaction.verify())
        console.log(transaction.isFullySigned())
    }
});
