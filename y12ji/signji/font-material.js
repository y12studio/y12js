//
// <link href="material-icon-font.css" rel="stylesheet">
// <md-icon>&#xE87C;</md-icon> work
// <md-icon>face</md-icon> dont work, ligatures+data:uri font dont work.
// material icon codepoints index
// https://github.com/google/material-design-icons/blob/master/iconfont/codepoints
// Material icons guide - Google design
//  https://google.github.io/material-design-icons/#getting-icons

var fs = require("fs")
var request = require('request')
var url = 'https://fonts.gstatic.com/s/materialicons/v10/2fcrYFNaTjcS6g4U3t-Y5ewrjPiaoEww8AihgqWRJAo.woff'
// "data:font/ttf;base64,AAEAAAALAI...."
// "data:application/font-woff;base64,AAEAAAALAI...."

fs.readFile('material-icon-font.tpl.css', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  request({url:url,encoding: null}, function(error, response, result) {
      if (!error && response.statusCode == 200) {
          // console.log(result)
          var b64 = result.toString('base64');
          var cssResult = data.replace(url, 'data:application/font-woff;base64,' + b64)
          fs.writeFileSync('material-icon-font.css', cssResult, 'utf8')
          // console.log(cssResult)
      }
  })

  console.log(data);
});
