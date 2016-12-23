var Promise = require('bluebird')
var isvalid = require('isvalid')
const fetch = require('node-fetch')
var bitcore = require('bitcore-lib')
var Unit = bitcore.Unit
var HDPrivateKey = bitcore.HDPrivateKey
var Hash = bitcore.crypto.Hash
var Buffer = bitcore.deps.Buffer
const apiurl = 'https://api.coindesk.com/v1/bpi/currentprice/TWD.json'
const token = require('./token.json')

function MyApp() {
    this.init()
}

MyApp.ValidationSchema = {
    twd: {
        type: Number,
        default: 50000
    },
    foo: {
        type: String,
        default: 'hello'
    }
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

MyApp.hello = function() {
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

MyApp.validateParams = function(eventQueryStringParameters) {
    return new Promise(function(resolve, reject) {
        isvalid(eventQueryStringParameters, MyApp.ValidationSchema, function(err, validData) {
            if (err) {
                reject(err)
            } else {
                resolve(validData)
            }
        })
    })
}

MyApp.fetchJson = function(url) {
    return fetch(url).then(function(res) {
        return res.json()
    })
}

MyApp.toRespTemplate = function(code, res) {
    // Required for CORS support to work
    return {
        statusCode: code,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(res)
    }
}

MyApp.prototype.process = function(eventQueryStringParameters) {
    var that = this
    var r = {}
    var share = {}
    return MyApp.validateParams(eventQueryStringParameters).then(function(param) {
        share.param = param
        return MyApp.fetchJson(apiurl)
    }).then(function(json) {
        share.json = json
        return that.saveToFb(json, share.param)
    })
}

MyApp.prototype.fbclose = function() {
    this.firebase.database().goOffline()
    return this.app.delete()
}

MyApp.prototype.saveToFb = function(json, param) {
    var that = this
    var r = {}
    var fmtObj = MyApp.formatTwd(json)
    // console.log(fmtObj)
    r.btcusd = fmtObj.btcusd
    r.btctwd = fmtObj.btctwd
    r.usdtwd = fmtObj.usdtwd
    r.twd = param.twd
    r.btc = Unit.fromBTC(r.twd / r.btctwd).BTC
    var keyobj = MyApp.rankey()
    r.key = keyobj.keyhex
    r.address = keyobj.address
    return that.signin().then(function(user) {
        r.uid = user.uid
        r.time = that.firebase.database.ServerValue.TIMESTAMP
        return that.btctwdsRef.push(r)
    }).then(function() {
        // https://github.com/serverless/serverless/issues/2769
        return that.fbclose()
    }).then(function() {
        var res = {
            result: 'ok',
            btctwd: r.btctwd,
            twd: r.twd,
            btc: r.btc
        }
        return MyApp.toRespTemplate(200, res)
    })
}
module.exports = MyApp
