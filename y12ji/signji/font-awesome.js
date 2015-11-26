var fs = require("fs")
var request = require('request')
var url = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff?v=4.5.0'
// "data:font/ttf;base64,AAEAAAALAI...."
// "data:application/font-woff;base64,AAEAAAALAI...."

fs.readFile('font-awesome-v4.5.0.tpl.css', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  request({url:url,encoding: null}, function(error, response, result) {
      if (!error && response.statusCode == 200) {
          // console.log(result)
          var b64 = result.toString('base64');
          var cssResult = data.replace(url, 'data:application/font-woff;base64,' + b64)
          fs.writeFileSync('font-awesome-v4.5.0.css', cssResult, 'utf8')
          // console.log(cssResult)
      }
  })

  console.log(data);
});
