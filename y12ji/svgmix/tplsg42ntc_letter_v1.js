var _ = require('lodash')
var moment = require('moment')
require('shelljs/global')
var sg42ntc = require('./sg42ntc-export.json')
console.log(sg42ntc.authors)

var name = 'SEPHIROTHPAN'
var author = sg42ntc.authors[name]
console.log(author)

var file = 'LETTER_'+name+'.svg'
cp('LETTER_TPL.svg', file)
sed('-i', '10595', author.postcode, file)
sed('-i', '台北市松山區復興北路1號999樓之999', author.address, file)
sed('-i', '0900-123456', author.phone, file)
sed('-i', '王大明', author.name, file)
