angular.module('fooApp', ['ui.bootstrap'])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
  })
  .controller('MainCtrl', ['$scope', '$location', function($scope, $location) {

    /*
    p = prior
    c1 = conditional #1
    c2 = conditional #2
    */
    var calcp = function(p, c1, c2) {
      return ((c1 * p) / (c1 * p + c2 * (100 - p))) * 100;
    }

    $scope.A = 'Cancer';
    $scope.B = 'PositiveTest';
    $scope.PA = 1;
    $scope.PBA = 80;
    $scope.PBNA = 9.6;
    $scope.PAB = 0.0;
    $scope.PANB = 0.0;


    $scope.$watchGroup(['PA', 'PBA', 'PBNA'], function(newValues, oldValues, scope) {
      $scope.PAB = calcp($scope.PA, $scope.PBA, $scope.PBNA);
      $scope.PANB = calcp($scope.PA, 100 - $scope.PBA, 100 - $scope.PBNA);
      changeP($scope.root.arr, $scope.PA, 'glyphicon-remove', 'glyphicon-ok');
      changeP($scope.root.brr, $scope.PBA, 'text-danger', 'text-info');
      changeP($scope.root.abrr, $scope.PAB, 'text-danger', 'text-primary');
    });

    $scope.root = {};

    $scope.root.arr = _.map(_.range(10), function(i) {
      return _.map(_.range(10), function(j) {
        return {
          i: i,
          j: j,
          class: 'glyphicon-ok'
        };
      });
    });

    $scope.root.brr = _.map(_.range(10), function(i) {
      return _.map(_.range(10), function(j) {
        return {
          i: i,
          j: j,
          class: 'text-info'
        };
      });
    });

    $scope.root.abrr = _.map(_.range(10), function(i) {
      return _.map(_.range(10), function(j) {
        return {
          i: i,
          j: j,
          class: 'text-info'
        };
      });
    });

    $scope.onClickCancer= function(){
        $scope.A = 'Cancer';
        $scope.B = 'PositiveTest';
        $scope.PA = 1;
        $scope.PBA = 80;
        $scope.PBNA = 9.6;
    };

    $scope.onClickDrugUser= function(){
        $scope.A = 'Drug';
        $scope.B = 'PositiveTest';
        $scope.PA = 0.5;
        $scope.PBA = 99;
        $scope.PBNA = 1;
    }

    var changeP = function(arr, value, classYes, classNo) {
      for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
          var index = i * 10 + j;
          arr[i][j].class = index < value ? classYes : classNo;
        }
      }
    };

  }]);
