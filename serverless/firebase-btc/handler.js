'use strict'
const MyApp = require('./myapp')


// http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format
module.exports.hello = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    var myapp = new MyApp()
    myapp.process(event.queryStringParameters)
        .then(
            function(res) {
                // http://stackoverflow.com/questions/37325775/amazon-lambda-to-firebase
                const response = {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                    },
                    body: JSON.stringify(res)
                }
                callback(null, response)
            }).catch(function(err) {
            callback('Database push error ' + err)
        })
};
