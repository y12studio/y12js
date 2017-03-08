#### 2017-03-08T14:52:46+0800

* External JavaScript dependencies in Typescript and Angular 2 - Rick Strahl's Web Log  https://weblog.west-wind.com/posts/2016/Sep/12/External-JavaScript-dependencies-in-Typescript-and-Angular-2
* How to run jasmine tests without browser ? · Issue #2013 · angular/angular-cli  https://github.com/angular/angular-cli/issues/2013
* angular4 - SyntaxError: Unexpected token 'const' for testing.es5.js - Stack Overflow  http://stackoverflow.com/questions/42513591/syntaxerror-unexpected-token-const-for-testing-es5-js
* Protractor - end-to-end testing for AngularJS  http://www.protractortest.org/#/tutorial

```
$ npm --version
3.10.10
$ ng --version
    _                      _                 ____ _     ___
   / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
  / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
 / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
/_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
               |___/
@angular/cli: 1.0.0-rc.1
node: 6.9.5
os: linux x64
@angular/common: 2.4.9
@angular/compiler: 2.4.9
@angular/core: 2.4.9
@angular/forms: 2.4.9
@angular/http: 2.4.9
@angular/platform-browser: 2.4.9
@angular/platform-browser-dynamic: 2.4.9
@angular/router: 3.4.9
@angular/cli: 1.0.0-rc.1
@angular/compiler-cli: 2.4.9

$ phantomjs --version
2.1.1

$ ng new foo
$ cd foo
$ npm i lodash -S
$ npm i @types/lodash -D
$ npm i karma-phantomjs-launcher -D
$ ng serve --host 0.0.0.0
$ ng build -prod
$ ng test
$ sudo npm install -g protractor
$ protractor --version
Version 5.1.1
$ sudo webdriver-manager update
$ webdriver-manager status
[17:09:59] I/status - selenium standalone version available: 3.3.0 [last]
[17:09:59] I/status - chromedriver version available: 2.27 [last]
[17:09:59] I/status - geckodriver version available: v0.14.0 [last]
[17:09:59] I/status - android-sdk is not present
[17:09:59] I/status - appium is not present
$ ls /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/
chromedriver_2.27           gecko-response.json
chromedriver_2.27.zip       selenium-server-standalone-3.3.0.jar
chrome-response.xml         standalone-response.xml
geckodriver-v0.14.0         update-config.json
geckodriver-v0.14.0.tar.gz
$ node node_modules/protractor/bin/webdriver-manager update

$ ng e2e
[18:51:06] I/update - chromedriver: chromedriver_2.27 up to date
[18:51:06] I/launcher - Running 1 instances of WebDriver
[18:51:06] I/direct - Using ChromeDriver directly...
[18:51:06] E/launcher - unknown error: cannot find Chrome binary
  (Driver info: chromedriver=2.27.440175 (9bc1d90b8bfa4dd181fbbf769a5eb5e575574320),platform=Linux 3.13.0-100-generic x86_64)
[18:51:06] E/launcher - WebDriverError: unknown error: cannot find Chrome binary
  (Driver info: chromedriver=2.27.440175 (9bc1d90b8bfa4dd181fbbf769a5eb5e575574320),platform=Linux 3.13.0-100-generic x86_64)
    at WebDriverError (/home/lin/git/y12js/angular2/foo/node_modules/selenium-webdriver/lib/error.js:27:5)

```
