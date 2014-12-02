var Ypp = function() {};

Ypp.NavGo = function(path) {
  location.href = path;
};

Ypp.ExtGo = function(url) {
  window.open(url, '_blank');
};

Ypp.ExtQr = function(addr) {
  var url = 'https://blockchain.info/address/' + addr;
  window.open(url, '_blank');
};

Ypp.ExtBroadcast = function() {
  window.open('https://helloblock.io/propagate', '_blank');
};

Ypp.ExtHelloAddr = function(addr) {
  var url = 'https://helloblock.io/addresses/' + addr;
  window.open(url, '_blank');
};

Ypp.ExtHelloTx = function(tx) {
  var url = 'https://helloblock.io/transactions/' + tx;
  window.open(url, '_blank');
};

Ypp.ExtBcInfoTx = function(tx) {
    var url = 'https://blockchain.info/tx/' + tx;
    window.open(url, '_blank');
};

Ypp.PbPrint = function(pbobj) {
  console.log(pbobj);
  console.log('hex=' + pbobj.toHex());
  console.log('calculate size = ' + pbobj.calculate());
  console.log('result hex = ' + pbobj.orhex);
  console.log('result size = ' + pbobj.orsize);
};

Ypp.PbPost = function(pbobj) {
  pbobj.orhex = '590c' + pbobj.toHex();
  pbobj.orsize = pbobj.orhex.length / 2;
};

Ypp.PbParsePre = function(hexStr) {
    // 590c[data]
  var r = '';
  if (hexStr.indexOf('590c') == 0) {
    r = hexStr.substring(4);
  }
  return r;
};
