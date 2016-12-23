'use strict'
const MyApp = require('./myapp')
module.exports.hello = (event, context, callback) => {
    var res = {
        result: 'hello world'
    }
    callback(null, MyApp.toRespTemplate(200, res))
};

module.exports.btctwd = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    var myapp = new MyApp()
        // http://stackoverflow.com/questions/37325775/amazon-lambda-to-firebase
    myapp.process(event.queryStringParameters)
        .then(function(res) {
            callback(null, res)
        }).catch(function(err) {
            callback('Database push error ' + err)
        })
};
