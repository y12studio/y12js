var bitcore = require('bitcore');
var PrivateKey = bitcore.PrivateKey;

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class BitBox {

    constructor(x, y) {
        this.key =  new PrivateKey();
    }

    address() {
        let address = this.key.toAddress();
        console.log(typeof this.key);
        console.log(this.key instanceof PrivateKey);
        return address.toString();
    }
}

if (require.main === module) {
    let pt = new Point(7, 4);
    console.log(`My point: ${JSON.stringify(pt)}`);
    let bb = new BitBox();
    console.log(bb.address());
}
