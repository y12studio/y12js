_.mixin(_.str.exports());

angular.module('fooApp', [])
  .controller('MainCtrl', ['$scope', function($scope) {
    $scope.hello = _.range(10).join();
    // _.range(10);
    $scope.foos = _.map(_.range(8), function(num){
        return {name:'fXo'+num, desc:_.sprintf("desc : GG-haha-%0.2f", num*0.25)}
    });

    $scope.todos = [{
      text: 'learn angular',
      done: true
    }, {
      text: 'build an angular app',
      done: false
    }];

    $scope.addTodo = function() {
      $scope.todos.push({
        text: $scope.todoText,
        done: false
      });
      $scope.todoText = '';
    };

    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) $scope.todos.push(todo);
      });
    };

  }]);
