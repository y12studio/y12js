_.mixin(_.str.exports());
angular.module('fooApp', ['ui.bootstrap', 'firebase'])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
  })
  .controller('MainCtrl', ['$scope', '$timeout', '$firebase', function($scope, $timeout, $firebase) {

    var ref = new Firebase("https://publicdata-cryptocurrency.firebaseio.com/bitcoin");
    // create an AngularFire reference to the data
    var sync = $firebase(ref);
    // download the data into a local object

    var bitcoin = sync.$asObject();

    $scope.data = bitcoin;
    $scope.count = 0;
    $scope.prelast = 0;
    $scope.NTD = 89;
    $scope.BTC = 0.009;
    $scope.coffee = '';
    $scope.cssCount = '';

    $scope.updateCoffee = function() {
      var cbtc = $scope.NTD / (bitcoin.last * 30);
      $scope.coffee = _.sprintf("%.8f", cbtc);
      var cntd = $scope.BTC *  (bitcoin.last * 30);
      $scope.coffeeNTD = _.sprintf("%.2f", cntd);
    }

     bitcoin.$loaded().then(function() {
         $scope.updateCoffee();
     });

    ref.on('child_changed', function(childSnapshot, prevChildName) {
      childname = childSnapshot.name();
      //console.log($scope.prelast);
      //console.log($scope.data);
      if (childname == 'last') {
        $scope.count++;
        $scope.prelast = bitcoin.last;
        $scope.updateCoffee();
        $scope.cssCount = 'bounce';
        $timeout(function() {
          $scope.cssCount = '';
        }, 1300);
      }

      if (childname == '_updated') {
        // console.log($scope.count);
        // $scope.cssCount = 'flash';
      }
    });

  }]);
