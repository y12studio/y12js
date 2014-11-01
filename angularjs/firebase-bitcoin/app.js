angular.module('fooApp', ['ui.bootstrap', 'firebase'])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
  })
  .controller('MainCtrl', ['$scope', '$timeout', '$firebase', function($scope, $timeout, $firebase) {

    var ref = new Firebase("https://publicdata-cryptocurrency.firebaseio.com/bitcoin");
    // create an AngularFire reference to the data
    var sync = $firebase(ref);
    // download the data into a local object
    $scope.data = sync.$asObject();

    $scope.count = 0;
    $scope.prelast = 0;
    $scope.cssCount = '';

    ref.on('child_changed', function(childSnapshot, prevChildName) {
      childname = childSnapshot.name();
      //console.log(childname);
      //console.log($scope.prelast);
      //console.log($scope.data);
      if(childname == 'last'){
        $scope.prelast = $scope.data.last;
      }
      if (childname == '_updated') {
        $scope.count++;
        // console.log($scope.count);
        // $scope.cssCount = 'flash';
        $scope.cssCount = 'bounce';
        $timeout(function() {
          $scope.cssCount = '';
        }, 1300);
      }
    });

  }]);
