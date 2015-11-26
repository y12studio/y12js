var inline = require('web-resource-inliner')
var fs = require("fs")
var request = require('request')
request({
    url: 'https://y12ji.com/p2015/hexcard/'
}, function(error, response, result) {
    if (!error && response.statusCode == 200) {
        // console.log(result)
        inline.html({
            fileContent: result,
            relativeTo:'https://y12ji.com/p2015/hexcard/',
            images:true
        }, function(error, htmlFinal) {
            var htmlResult = htmlFinal.replace("Y12JI_RELEASE_INFO_TAG", 'TEST AT TAICHUNG CITY');
            fs.writeFileSync('test.html', htmlResult, 'utf8')
        })
    }
})
