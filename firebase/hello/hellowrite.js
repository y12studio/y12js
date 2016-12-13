var firebase = require("firebase");
var tokenjs = require("./token.json")
// Initialize Firebase
var config = tokenjs.config
var user = tokenjs.user
firebase.initializeApp(config)
    // Get a reference to the database service
var database = firebase.database()

firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function(user) {
    console.log(user)
    const ct = new Date().toISOString()
    const timestamp = Math.floor(Date.now() / 1000)
    database.ref('poc/hellos').push({
        name: 'hello-' + timestamp,
        title: ct
    }, function() {
        //  Lambda you should call context.succeed()
        process.exit()
    })
}).catch(function(error) {
    console.log(error)
})
