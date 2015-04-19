function loadJSON(url){
  var json = UrlFetchApp.fetch(url).getContentText();
  var data = JSON.parse(json);
  return data;
}

function loadStats(){
  var array = [];
  var url = 'https://blockchain.info/stats?format=json';
  var data = loadJSON(url);
  array.push(['hash rate GH/s',data['hash_rate']]);
  array.push(['difficulty',data['difficulty']]);
  Logger.log(array);
  return array;
}
