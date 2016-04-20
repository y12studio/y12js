var Web3 = require('web3')
var Tx = require('ethereumjs-tx')
var Util = require('ethereumjs-util')
var coder = require('web3/lib/solidity/coder.js')
var SolidityFunction = require('web3/lib/web3/function.js')

function app() {}

app.ethCallRpcResult = function(contract,functionName, rpcResultHex) {
    var web3 = new Web3()
    var functionAbi = contract.abi.find(function(element, index, array) {return element.name==functionName})
    var solidityFunction = new SolidityFunction(web3.eth, functionAbi, contract.address)
    return solidityFunction.unpackOutput(rpcResultHex)
}

module.exports = {
    Web3: Web3,
    yeth: app,
    Tx: Tx,
    coder : coder,
    SolidityFunction: SolidityFunction,
    Util: Util
}
