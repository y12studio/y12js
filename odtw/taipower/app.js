var Yoo = require('./yoo')
var yoo = new Yoo()

var inPath = 'records-160704.csv'
yoo.convertCsv(inPath,'records-origin30.csv',30, null)
yoo.convertCsv(inPath,'records-wavg30.csv',30, Yoo.weightAvg)
yoo.convertCsv(inPath,'records-avg30.csv',30, Yoo.avg)
yoo.convertCsv(inPath,'records-160704-wavg.csv',0, Yoo.weightAvg)
