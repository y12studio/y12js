Using the ES6 transpiler Babel on Node.js
 http://www.2ality.com/2015/03/babel-on-node.html

```
o$ npm test

> @ test /home/lin/git/y12js/node/bitcore-node/es6foo
> jest


  == NOTICE: ==
    On August 1st, 2015, Jest v0.5.x will work only on io.js
    Legacy v0.4.x for Node 0.10.x will still be available on
    on npm and from the "0.4.x" branch on GitHub.

Using Jest CLI v0.4.15
 FAIL  test/point.test.js (1.64s)
{"x":1,"y":5}
● Point › it sets up instance properties correctly
  - Invalid Argument: Must be an instance of PrivateKey
    Error
        at Error.NodeError (/home/lin/git/y12js/node/bitcore-node/
...
```
