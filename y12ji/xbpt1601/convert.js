var jsonfile = require('jsonfile')

function processFile(inputFile,outputFile) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new(require('stream'))(),
        rl = readline.createInterface(instream, outstream);
    var r = []
    var count = 0
    var pid = 0
    var lastr = {}
    // 3,8,13,18

    rl.on('line', function(line) {
        var v = count -3
        if(v%5==0){
            lastr = {}
            pid++
            lastr.pid = pid
            lastr.title = line.substring(3)
        }
        if(v%5==1){
            lastr.poet = line.substring(3)
        }
        if(v%5==2){
            lastr.type = line.substring(3)
        }
        if(v%5==3){
            lastr.poetry = line.substring(line.indexOf('詩文:(')==0?8:3)
            r.push(lastr)
        }
        count++
    })

    rl.on('close', function(line) {
        jsonfile.writeFileSync(outputFile, r, {spaces: 2})
    })
}
// corpus/唐詩三百首.txt at master · rime-aca/corpus
// https://github.com/rime-aca/corpus/blob/master/%E5%94%90%E8%A9%A9%E4%B8%89%E7%99%BE%E9%A6%96.txt
processFile('tang_poetry300.txt','tang_poetyr300.json');
