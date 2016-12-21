'use strict'
const MyApp = require('./myapp')

// https://github.com/sequelize/sequelize/issues/4938
module.exports.hello = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false
    var myapp = new MyApp()
    myapp.buildResponse().then(function(res) {
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
