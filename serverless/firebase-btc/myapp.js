var Promise = require('bluebird')
const fetch = require('node-fetch')
var bitcore = require('bitcore-lib')
var HDPrivateKey = bitcore.HDPrivateKey
var Hash = bitcore.crypto.Hash
var Buffer = bitcore.deps.Buffer
const url = 'https://api.coindesk.com/v1/bpi/currentprice/TWD.json'
const token = require('./token.json')

function MyApp() {
    this.init()
}

MyApp.prototype.init = function() {
    this.firebase = require('firebase')
    this.app = this.firebase.initializeApp(token.fbconf)
    var rootRef = this.firebase.database().ref('fbase1606')
    this.btctwdsRef = rootRef.child('btctwds')
}

MyApp.prototype.signin = function() {
    return this.firebase.auth().signInWithEmailAndPassword(token.fbauth.email, token.fbauth.password)
}

MyApp.prototype.hello = function() {
    return 'hello world'
}

MyApp.formatTwd = function(json) {
    console.log(json)
    var bpi = json.bpi
    var btcusd = bpi.USD.rate_float
    var btctwd = bpi.TWD.rate_float
    var usdtwd = btctwd / btcusd
    return {
        raw: json,
        btcusd: Math.round(btcusd),
        btctwd: Math.round(btctwd),
        usdtwd: Math.round(usdtwd * 100) / 100,
        time: new Date().toTimeString()
    }
}

MyApp.rankey = function() {
    var hd = new HDPrivateKey()
    var key = hd.privateKey
    return {
        key: key,
        keyhex: key.toString('Hex'),
        address: key.toAddress().toString()
    }
}

MyApp.prototype.buildResponse = function() {
    var that = this
    var r = {}
    var p = fetch(url).then(function(res) {
        return res.json()
    }).then(function(json) {
        var fmtObj = MyApp.formatTwd(json)
        console.log(fmtObj)
        r.btcusd = fmtObj.btcusd
        r.btctwd = fmtObj.btctwd
        r.usdtwd = fmtObj.usdtwd
        var keyobj = MyApp.rankey()
        r.key = keyobj.keyhex
        r.address = keyobj.address
        return that.signin()
    }).then(function(user) {
        r.uid = user.uid
        r.time = that.firebase.database.ServerValue.TIMESTAMP
        return that.btctwdsRef.push(r)
    }).then(function() {
        // https://github.com/serverless/serverless/issues/2769
        that.firebase.database().goOffline()
        return that.app.delete()
    }).then(function(){
        return {result:'ok',btctwd:r.btctwd}
    })
    return p
}
module.exports = MyApp
