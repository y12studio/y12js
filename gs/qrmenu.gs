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

function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menubuttons = [ {name: "存入訂單", functionName: "saveOrder"},
                      {name: "清除數量", functionName: "clearRange"}];
    ss.addMenu("阿發商店", menubuttons);
} // note y

function clearRange() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('MENU');
  sheet.getRange('C5:C9').clearContent();
}

function saveOrder() {
  Browser.msgBox("TODO: 存入訂單");
}
