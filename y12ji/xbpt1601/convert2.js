var jsonfile = require('jsonfile')
var obj = jsonfile.readFileSync('tang_poetry300.json')
var r = []
obj.forEach(function(e,i,a){
    var s = e.poetry.replace(/[，。？]+/g,'').split('')
    //console.log(s)
    r = r.concat(s)
})
console.log(r.length)
ur = r.filter(function(item, pos) {
    return r.indexOf(item) == pos;
})
console.log(ur.length)
// 2048 words
// bips/bip-0039.mediawiki at master · bitcoin/bips
// https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
jsonfile.writeFileSync('tarr.json', ur.sort().slice(0,2048), {spaces: 2})
