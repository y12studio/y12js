//angularjs - How to access/update $rootScope from outside Angular - Stack Overflow
// http://stackoverflow.com/questions/24595460/how-to-access-update-rootscope-from-outside-angular
var rootScope;
var GVAR1 = 999,
    GVAR2 = 199;

angular.element(document).ready(function() {
    var injector = angular.element(document.body).injector();
    rootScope = injector.get('$rootScope');
});

var app = angular.module('StarterApp', ['ngMaterial']);
//var ctrl;
app.controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {
    //ctrl = this;
    $scope.gvar1 = "Hello World";
    $scope.countDown = 9999;

    iter = $interval(function() {
        $scope.gvar1 = $scope.countDown--;
        GVAR1 = $scope.gvar1;
    }, 1000, 0);

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

}]);

//-----------------------
// nwjs

var gui = require('nw.gui'),
    http = require('http');

server = http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    GVAR2+=1;
    console.log("GET "+request.url);
    rootScope.$broadcast('gvar2-update', GVAR2);
    response.end('Hello GVAR1 ' + GVAR1);
}).listen(8000, '127.0.0.1');
