"use strict";
/// <reference path="typings/modules/lodash/index.d.ts" />
var _ = require('lodash');
var Greeter = (function () {
    function Greeter(greeting) {
        this.greeting = greeting;
    }
    Greeter.prototype.greet = function () {
        return "Hi " + this.greeting;
    };
    return Greeter;
}());
;
var greeter = new Greeter("Bob");
console.log(_.toUpper('Hellodash, world ! ' + greeter.greet()));
_.map([1, 2, 3], function (v) {
    console.log(v * v);
});
