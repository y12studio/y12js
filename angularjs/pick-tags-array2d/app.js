_.mixin(_.str.exports());

angular.module('fooApp', ['ui.bootstrap'])
  .controller('MainCtrl', ['$scope', function($scope) {

    $scope.radioModel = '90A';

    $scope.mouseEnterEnable = false;

    $scope.root = {
      xaxis: _.map(_.range(17), function(num) {
        return _.sprintf("-%0.2f", num * 0.25);
      }),
      yaxis: _.map(_.range(41), function(num) {
        return _.sprintf("-%0.2f", num * 0.25);
      }),
      arr: _.map(_.range(41), function(y) {
        return _.range(y * 17, y * 17 + 17);
      }),
    };

    $scope.root.objs = _.flatten(_.map($scope.root.yaxis, function(y) {
      return _.map($scope.root.xaxis, function(x) {
        return {
          x: x,
          y: y,
          class: 'glyphicon-remove-circle color-unpick'
        };
      });
    }));

    $scope.mouseenter = function(id) {
      if ($scope.mouseEnterEnable) {
        console.log('pick enter ' + id)
        $scope.updatePick(id);
      }
    };

    $scope.updatePick = function(id) {
      console.log('update ' + id)
      target = $scope.root.objs[id];
      console.log(target)
      target.class = 'glyphicon-ok-circle color-pick-' + $scope.radioModel;
    }

    $scope.pick = function(id) {
      console.log('pick click ' + id)
      if (!$scope.mouseEnterEnable) {
        $scope.updatePick(id);
      }
      $scope.mouseEnterEnable = !$scope.mouseEnterEnable;
    };

    //$scope.pickclass = 'glyphicon-ok-circle';

    $scope.pickclass = function(x, y) {
      console.log('pick class ' + x + ',' + y)
      if (x < -2) {
        return 'glyphicon-remove-circle';
      } else {
        return 'glyphicon-ok-circle';
      }
    };

  }]);
