KEY_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

angular.module('fooApp', ['ui.bootstrap'])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
  })
  .controller('MainCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.rancode = '';
    $scope.address = '';
    $scope.wif = '';
    $scope.count = 0;
    $scope.progress = 0;
    $scope.max = 36;

    // Utility functions

    // Accepts a MouseEvent as input and returns the x and y
    // coordinates relative to the target element.
    var getCrossBrowserElementCoords = function(mouseEvent) {
      var result = {
        x: 0,
        y: 0
      };

      if (!mouseEvent) {
        mouseEvent = window.event;
      }

      if (mouseEvent.pageX || mouseEvent.pageY) {
        result.x = mouseEvent.pageX;
        result.y = mouseEvent.pageY;
      } else if (mouseEvent.clientX || mouseEvent.clientY) {
        result.x = mouseEvent.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
        result.y = mouseEvent.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
      }

      if (mouseEvent.target) {
        var offEl = mouseEvent.target;
        var offX = 0;
        var offY = 0;

        if (typeof(offEl.offsetParent) != "undefined") {
          while (offEl) {
            offX += offEl.offsetLeft;
            offY += offEl.offsetTop;

            offEl = offEl.offsetParent;
          }
        } else {
          offX = offEl.x;
          offY = offEl.y;
        }

        result.x -= offX;
        result.y -= offY;
      }
      return result;
    };

    var getMouseEventResult = function(mouseEvent, mouseEventDesc) {
      var coords = getCrossBrowserElementCoords(mouseEvent);
      return mouseEventDesc + " at (" + coords.x + ", " + coords.y + ")";
    };

    var getRandomCode = function(mouseEvent) {
      //console.log($scope.count);
      $scope.count++;
      if ($scope.count % 10 == 0) {
        var coords = getCrossBrowserElementCoords(mouseEvent);
        X = coords.x;
        Y = coords.y;

        time = new Date().getTime();
        var num = (Math.pow(X, 3) + Math.pow(Y, 3) + Math.floor(time * 1971) + Math.floor(Math.random() * 1000)) % 62;
        return KEY_CHARS.charAt(num % KEY_CHARS.length);
      } else {
        return '';
      }
    }

    var reset = function() {
      $scope.rancode = '';
      $scope.address = '';
      $scope.wif = '';
      $scope.count = 0;
      $scope.progress = 0;
      //$location.path('').replace();
      location.replace('');
    }

    $scope.reset = function(e) {
      reset();
    };

    $scope.$on("$locationChangeSuccess", function(event) {
      //console.log('location change success');
      //console.log($location);
      //console.log($location.path());
      //console.log($location.path().length);
      // /KzRhmTC6Qr2iKaLMEdodXTkjUZ5PD8prJC57FhKyPG68YJXjmHUK app.js:97
      //53
      var pathlen = $location.path().length;
      if (pathlen == 53) {
        $scope.wif = $location.path().slice(1);
        var key = bitcoin.ECKey.fromWIF($scope.wif);
        $scope.address = key.pub.getAddress().toString();
      } else if (pathlen > 0) {
        reset();
      }
    });

    $scope.onMouseMove = function(e) {
      if ($scope.wif.length != 0) {
        return;
      }
      if ($scope.rancode.length < $scope.max) {
        r = getRandomCode(e);
        //console.log("GET " + r);
        //console.log('len = ' + r.length);
        if (r.length > 0) {
          $scope.rancode += r;
          $scope.progress = Math.floor($scope.rancode.length * 100 / 36);
        }
      } else if ($scope.rancode.length == $scope.max) {
        var btcKey = bitcoin.ECKey.makeRandom(true, function(size) {
          return bitcoin.crypto.hash256($scope.rancode);
        });
        $scope.address = btcKey.pub.getAddress().toString();
        $scope.wif = btcKey.toWIF();
        // location.replace("#" + $scope.wif);
        //console.log($location);
        $location.path($scope.wif).replace();
      }
    };

  }]);
