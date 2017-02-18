var _ = require('lodash')
var start = 4899
var end = 5211
var r = (end - start)/2
var num = 10
var x = _.map(_.range(num+1),function(n){
    return Math.round((n*(2*r/num) + start))
})
var y = _.map(_.range(num+1), function(n){
    var x = n*2/num - 1
    return (x).toFixed(4)
})
console.log(x, y)
