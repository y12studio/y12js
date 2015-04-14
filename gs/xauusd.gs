// Copyright 2015 Y12STUDIO
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function loadFEETWD(){
  var array = [];
  var url = 'https://api.bitcoinaverage.com/ticker/global/TWD/';
  var json = loadJSON(url);
  array.push(["BTC/TWD",json['last']]);
  array.push(["FEE/TWD",json['last']/100000]);
  return array;
}

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

function loadJSON(url){
  var json = UrlFetchApp.fetch(url).getContentText();
  var data = JSON.parse(json);
  return data;
}

function loadLatestBlock(){
  var array = [];
  var url = 'https://blockchain.info/latestblock';
  var data = loadJSON(url);
  array.push(['latest block height',data['height']]);
  array.push(['latest tx length',data['txIndexes'].length]);
  Logger.log(array);
  return array;
}
