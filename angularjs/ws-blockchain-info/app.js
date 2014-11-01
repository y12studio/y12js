_.mixin(_.str.exports());
angular.module('fooApp', ['ui.bootstrap'])
  .controller('MainCtrl', ['$scope', '$timeout', function($scope, $timeout) {

    $scope.count = 0;
    $scope.cssBig = '';
    $scope.size = 0;
    $scope.targetIn = '';
    $scope.targetOut = '';
    $scope.inputSize = 0;
    $scope.outSize = 0;

    var socket = new WebSocket('ws://ws.blockchain.info/inv');
    socket.onopen = function() {
      console.log('Connected!');
      // Unconfirmed transactions
      socket.send('{"op":"unconfirmed_sub"}');
    };
    socket.onmessage = function(event) {
      data = JSON.parse(event.data);
      // console.log(data);
      //$scope.size = data.x.size;
      //console.log($scope.size);
      $scope.$apply(function() {
        var sum_input = _.reduce(data.x.inputs, function(memo, v) {
          return memo + v.prev_out.value;
        }, 0);
        var sum_out = _.reduce(data.x.out, function(memo, v) {
          return memo + v.value;
        }, 0);
        $scope.size = data.x.size;
        $scope.inputSize = data.x.inputs.length;
        $scope.outSize = data.x.out.length;
        var vIn = sum_input/100000000;
        var vOut = sum_out/100000000;
        $scope.targetIn = _.sprintf("%.8f",vIn);
        $scope.targetOut = _.sprintf("%.8f",vOut);
        if(vIn>=1){
            $scope.cssBig = 'bounce';
            $scope.count++;
            $timeout(function(){
                $scope.cssBig = '';
            },1500);
        }
      });
    };
    socket.onclose = function() {
      console.log('Lost connection!');
    };



  }]);
