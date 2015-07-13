var bitcore = require('bitcore');
var PrivateKey = bitcore.PrivateKey;

function Bitbox() {
    this.type = 'FOO123';
    this.key = new PrivateKey();
    return this;
}

Bitbox.prototype.toObject = function toObject() {
    return {
        key: this.key,
        type: this.type
    };
};

Bitbox.prototype.toJSON = function toJSON() {
    return JSON.stringify(this.toObject());
};

Bitbox.prototype.addr = function toJSON() {
    var addr = this.key.toAddress();
    return addr.toString();
};

Bitbox.saddr = function() {
    var key = new PrivateKey();
    var addr = key.toAddress();
    return addr.toString();
}

module.exports = Bitbox;

if (require.main === module) {
    console.log(Bitbox.saddr());
    var bb = new Bitbox();
    console.log(bb.toJSON());
}
