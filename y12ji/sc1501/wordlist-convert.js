var readline = require('readline')
var fs = require('fs')

function write(data, dest){
    fs.writeFile(dest, JSON.stringify(data), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + dest);
        }
    });
}

function convert(src,dest) {
    var r = []
    readline.createInterface({
        input: fs.createReadStream(src)
    }).on('line', function(line) {
        r.push(line)
    }).on('close',function(){
        write(r, dest)
    })
}

convert('chinese_traditional.txt','chinese_traditional.json')
convert('chinese_simplified.txt','chinese_simplified.json')
