## Build the csv files.

```
$ curl https://rawgit.com/kiang/taipower/master/sell_amt/records.csv -o records-160704.csv
$ npm install && npm test
$ node app.js
```

## Issue

輸出雙月合理調整值 · Issue #1 · kiang/taipower
 https://github.com/kiang/taipower/issues/1

售電資料CSV OpenData - FB
 https://www.facebook.com/groups/odtwn/permalink/1550837408264005/

## Google 試算表

### 原始匯入版本

三里比較圖-各縣市村里用電資訊 - google 試算表
 https://docs.google.com/spreadsheets/d/13aH8TrBGuJTDx61lRhYdNxT0SIBWcNsgwbpJrpXnSWQ/

 ```
 IMPORTDATA("https://rawgit.com/kiang/taipower/master/sell_amt/records.csv")
 ```

臺北市/文山區/木新里、臺北市/內湖區/寶湖里和臺北市/內湖區/麗山里範例試算表輸出
 https://docs.google.com/spreadsheets/d/13aH8TrBGuJTDx61lRhYdNxT0SIBWcNsgwbpJrpXnSWQ/pubchart?oid=1778019287&format=interactive

直接匯入[kiang/taipower](https://github.com/kiang/taipower) 輸出的各縣市村里用電資訊csv(records.csv)，csv檔案大可能導致google 試算表延遲停滯。


### 雙月調整比對版本 160704

比較圖-各縣市村里用電資訊 - google 試算表
 https://docs.google.com/spreadsheets/d/1yGr5_njWlWcPnRgIdtd7RILThs-fHdedVERIUigPMNg

```
IMPORTDATA("https://rawgit.com/y12studio/y12js/master/odtw/taipower/records-origin30.csv")
IMPORTDATA("https://rawgit.com/y12studio/y12js/master/odtw/taipower/records-avg30.csv")
IMPORTDATA("https://rawgit.com/y12studio/y12js/master/odtw/taipower/records-wavg30.csv")
```

輸出圖
 https://docs.google.com/spreadsheets/d/1yGr5_njWlWcPnRgIdtd7RILThs-fHdedVERIUigPMNg/pubchart?oid=1778019287&format=interactive
