var Web3 = require('web3')
var Tx = require('ethereumjs-tx')
var Util = require('ethereumjs-util')
var coder = require('web3/lib/solidity/coder.js')
var SolidityFunction = require('web3/lib/web3/function.js')

function app() {}


app.getSolidityFuncion = function(abi,functionName){
    var functionAbi = abi.find(function(element, index, array) {
        return element.name == functionName
    })
    return new SolidityFunction('', functionAbi, '')
}

app.ethCallRpcResult = function(abi, functionName, rpcResultHex) {
    var sfun = app.getSolidityFuncion(abi.functionName)
    return sfun.unpackOutput(rpcResultHex)
}

module.exports = {
    Web3: Web3,
    yeth: app,
    Tx: Tx,
    coder: coder,
    SolidityFunction: SolidityFunction,
    Util: Util
}
