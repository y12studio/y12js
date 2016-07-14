/// <reference path="typings/modules/lodash/index.d.ts" />
import * as _ from 'lodash'

class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return "Hi " + this.greeting;
    }
};

var greeter = new Greeter("Bob")

console.log(_.toUpper('Hellodash, world ! ' + greeter.greet()))
_.map([1,2,3],function(v){
   console.log(v*v)
})
