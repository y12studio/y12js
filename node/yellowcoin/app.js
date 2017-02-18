var _ = require('lodash')
var base = 0.005867
var percent = _.range(970,1030,2)
var x = _.map(percent,function(p){
    return [p,(base*p/1000).toFixed(6)]
})
//var y = _.map(_.range(num+1), function(n){
//    var x = n*2/num - 1
//    return (x).toFixed(4)
//})
console.log(percent,x)
