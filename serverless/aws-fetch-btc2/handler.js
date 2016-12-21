'use strict';
const fetch = require('node-fetch')
const shuffle = require('shuffle-array')
const collection = [1, 2, 3, 4, 5]

var MyApp = require('./myapp')
var myapp = new MyApp()

module.exports.hello = (event, context, callback) => {
    myapp.buildResponse().then(function(res){
        callback(null, res);
    })
};
