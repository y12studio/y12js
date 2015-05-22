//angularjs - How to access/update $rootScope from outside Angular - Stack Overflow
// http://stackoverflow.com/questions/24595460/how-to-access-update-rootscope-from-outside-angular
var winston = require('winston');
winston.level = 'debug';
var rootScope;
var recursive = require('recursive-readdir');
var ftpClient = require('ftp');
var path = require('path');
var dateFormat = require('dateformat');
//-----------------------
// nwjs
var gui = require('nw.gui');


var GVAR1 = 999,
    GVAR2 = 199;

angular.element(document).ready(function() {
    var injector = angular.element(document.body).injector();
    rootScope = injector.get('$rootScope');
});

var app = angular.module('StarterApp', ['ngMaterial']);
app.controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {

    $scope.timeNow = new Date();
    $scope.files = [];
    // fps=1, repeat indefinitely.
    iter = $interval(function() {
        $scope.timeNow = new Date();
    }, 1000);

    $scope.$on('gvar2-update', function(event, args) {
        winston.debug(args);
        $scope.gvar2 = args;
    });

    $scope.$on('an:newfile', function(event, data) {
        winston.debug(data);
        $scope.files.push(data['file'] + '/' + data['eTime']);
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

    $scope.onClickGoHttpTest = function() {
        gui.Shell.openExternal("http://127.0.0.1:8000/")
    }

    $scope.onClickFtpClient = function() {
        var c = new ftpClient();
        c.on('ready', function() {
            c.put('README.md', 'README.md', function(err) {
                if (err) throw err;
                c.end();
                //c.close();
            });
        });
        // connect to localhost:21 as anonymous
        c.connect({
            'host': 'localhost',
            'port': 21,
            'user': 'john',
            'password': 'bar'
        });

    }

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



//----------------------
// http
var http = require('http');
var LASTURLS = [];
server = http.createServer(function(request, response) {
    lastUrl = '';
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    GVAR2 += 1;
    winston.debug("[HTTP] GET " + request.url);
    if (request.url != '/favicon.ico') {
        LASTURLS.push({
            'time': dateFormat(new Date()),
            'url': request.url
        });
    }
    // rootScope.$broadcast('gvar2-update', GVAR2);
    response.end('<h3>Request Urls</h3>' + LASTURLS.map(function(o) {
        return '<p><span style="margin-right:30px"><b>' + o['time'] + '</b></span>' + o['url'] + '</p>\r\n';
    }).join(''));
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
    // save file
    conn.on('file:stor', function(type, data) {
        console.log(type);
        if (type == 'close') {


            data['filename'] = path.basename(data['file']);
            winston.debug('[NEW FILE]');
            winston.debug(data);

            rootScope.$broadcast('an:newfile', data);

            http.get("http://127.0.0.1:8000/" + data['filename'], function(res) {
                console.log("Got response: " + res.statusCode);
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });

        }
    });
});

server.listen(21);
console.log('FTPD listening on port 21');
