//angularjs - How to access/update $rootScope from outside Angular - Stack Overflow
// http://stackoverflow.com/questions/24595460/how-to-access-update-rootscope-from-outside-angular
var rootScope;
var recursive = require('recursive-readdir');

var GVAR1 = 999,
    GVAR2 = 199;

angular.element(document).ready(function() {
    var injector = angular.element(document.body).injector();
    rootScope = injector.get('$rootScope');
});

var app = angular.module('StarterApp', ['ngMaterial']);
app.controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {

    $scope.timeNow = new Date();
    // fps=1, repeat indefinitely.
    iter = $interval(function() {
        $scope.timeNow = new Date();
    }, 1000);

    $scope.$on('gvar2-update', function(event, args) {
        console.log(args);
        $scope.gvar2 = args;
    });

    $scope.stopIter = function() {
        if (angular.isDefined(iter)) {
            $interval.cancel(iter);
            iter = undefined;
        }
    };

    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopIter();
    });

    listDir = function(path) {
        recursive(path, function(err, files) {
            // Files is an array of filename
            if (err) {
                console.log(err);
            } else {
                console.log(files);
                $scope.files = files;
            }
        });
    };

    $scope.dialogDirectory = function() {
        // File dialogs · nwjs/nw.js Wiki
        // https://github.com/nwjs/nw.js/wiki/File-dialogs
        // DWand/nw-fileDialog
        // https://github.com/DWand/nw-fileDialog
        var dialog = document.createElement('input');
        dialog.type = 'file';
        dialog.nwdirectory = 'nwdirectory';
        dialog.addEventListener('change', function() {
            var result = dialog.value;
            console.log("dialogDirectory : " + result);
            listDir(result);
        }, false);
        dialog.click();
    };

}]);

//-----------------------
// nwjs

var gui = require('nw.gui');

//----------------------
// http
var http = require('http');

server = http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    GVAR2 += 1;
    console.log("GET " + request.url);
    rootScope.$broadcast('gvar2-update', GVAR2);
    response.end('Hello GVAR1 ' + GVAR1);
}).listen(8000, '127.0.0.1');
//----------------------
// ftpd
//https://www.npmjs.com/package/ftpd
//----------------------
// ftpd
//https://www.npmjs.com/package/ftpd
var ftpd = require('./ftpd');
var fs = require('fs');

var options = {
    pasvPortRangeStart: 4000,
    pasvPortRangeEnd: 5000,
    getInitialCwd: function(connection, callback) {
        var userDir = process.cwd() + '/' + connection.username;
        console.log("Ftpd User Dir : " + userDir);
        fs.exists(userDir, function(exists) {
            if (exists) {
                callback(null, userDir);
            } else {
                fs.mkdir(userDir, function(err) {
                    callback(err, userDir);
                });
            }
        });
    },
    getRoot: function() {
        return "";
    }
};

var host = '127.0.0.1';

var server = new ftpd.FtpServer(host, options);

server.on('client:connected', function(conn) {
    var username;
    console.log('Client connected from ' + conn.socket.remoteAddress);
    conn.on('command:user', function(user, success, failure) {
        username = user;
        (user == 'john') ? success(): failure();
    });
    conn.on('command:pass', function(pass, success, failure) {
        // check the password
        (pass == 'bar') ? success(username): failure();
    });
});

server.listen(21);
console.log('FTPD listening on port 21');
