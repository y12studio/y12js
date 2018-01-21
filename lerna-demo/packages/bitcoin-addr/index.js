const bitcore = require('bitcore-lib')
var privateKey = new bitcore.PrivateKey()
var address = privateKey.toAddress()

module.exports = {
    randomkey : function(){
        return new bitcore.PrivateKey()
    },
   
    randomaddress : function(){
        var privateKey = new bitcore.PrivateKey()
        return privateKey.toAddress()
    }
  };