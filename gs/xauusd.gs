function loadYahoo(title, url){
  var array = [];
  var csv = UrlFetchApp.fetch(url).getContentText();
  var split = csv.split(",");
  array.push([title,split[1]]);
  Logger.log(array);
  return array;
}

function loadXAUUSD(){
  var url='http://download.finance.yahoo.com/d/quotes.csv?s=XAUUSD=X&f=sl1d1t1c1ohgv&e=.csv';
  return loadYahoo('XAU/USD',url);
}

function loadXAGUSD(){
  var url='http://download.finance.yahoo.com/d/quotes.csv?s=XAGUSD=X&f=sl1d1t1c1ohgv&e=.csv';
  return loadYahoo('XAG/USD',url);
}

function loadLatestBlock(){
  var array = [];
  var url = 'https://blockchain.info/latestblock';
  var json = UrlFetchApp.fetch(url).getContentText();
  var data = JSON.parse(json);
  array.push(['latest block height',data['height']]);
  array.push(['latest tx length',data['txIndexes'].length]);
  Logger.log(array);
  return array;
}
