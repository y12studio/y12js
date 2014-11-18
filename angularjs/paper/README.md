# bitcoinjs op_return and Buffer export issue.

[Exposing Buffer into the browser build by gmajoulet · Pull Request #308 · bitcoinjs/bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib/pull/308)

Keep Buffer function Inside.

## prefix hex string

```
OP_RETURN = 106 = 0x6a;
Script.fromASM('OP_RETURN '+hex);
```
## fork and modify
```
$ git clone https://github.com/y12studio/bitcoinjs-lib
$ cd bitcoinjs-lib
$ nano src/scripts.js
```
git diff
```
$ git diff
diff --git a/src/scripts.js b/src/scripts.js
index d768ae2..627c3d4 100644
--- a/src/scripts.js
+++ b/src/scripts.js
@@ -245,10 +245,16 @@ function dataOutput(data) {
   return Script.fromChunks([ops.OP_RETURN, data])
 }

+function dataOpReturnHex(hex){
+    var data = new Buffer(hex, 'hex')
+    return Script.fromChunks([ops.OP_RETURN, data])
+}
+
 module.exports = {
   classifyInput: classifyInput,
   classifyOutput: classifyOutput,
   dataOutput: dataOutput,
+  dataOpReturnHex: dataOpReturnHex,
   multisigInput: multisigInput,
   multisigOutput: multisigOutput,
   pubKeyHashInput: pubKeyHashInput,
```
export to [0.y12.tw/js/bitcoinjs/1.2.0/y12bitcoinjs.min.js](http://0.y12.tw/js/bitcoinjs/1.2.0/y12bitcoinjs.min.js)
```
$ npm run-script compile
$ mv bitcoinjs-min.js y12bitcoinjs.min.js
```
