var app = require('../app')
var abi = require('./etherex.json')
var Web3 = require('web3')
var assert = require('chai').assert
var yeth = app.yeth

beforeEach(function() {
    //do something before testing
});
afterEach(function() {
    //do something after testing
});

function padLeft(string, chars, sign) {
    return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
 }

describe('YETH', function() {
    it('rpcResult', function() {
        // etherex/EthereumClient.js at master · etherex/etherex
        // https://github.com/etherex/etherex/blob/master/frontend/app/clients/EthereumClient.js#L301
        console.log(abi)
        var web3 = new Web3()
        var ContractABI = web3.eth.contract(abi);
        var contract = ContractABI.at('0xe55c0e37ae260fa77fa15077bc30d4de972b76ed')
        var functionName = 'get_market(int256)'
        var rpcResultHex = '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000455458000000000000000000000000a5f8d8e6fc5cfb48b22335ed1ce5e5e0ad639ceb00000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000001ba8140000000000000000000000000cd2a3d9f938e13cd947ec05abc7fe734df8dd826000000000000000000000000000000000000000000000000000000000000eb0a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001'
        var market = yeth.ethCallRpcResult(contract, functionName, rpcResultHex)
        assert.equal(11, market.length)
        console.log(market)
        var id = market[0].toString()
        assert.equal(1, id)
        var name = web3.toAscii(web3.fromDecimal(market[1].toString()));
        assert.equal('ETX', name)
        var address = "0x" + padLeft(web3.fromDecimal(market[2]).slice(2), 40);
        assert.equal('0xa5f8d8e6fc5cfb48b22335ed1ce5e5e0ad639ceb',address)
    })

})
