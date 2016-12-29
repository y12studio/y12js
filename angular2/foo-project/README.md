Access outside localhost · Issue #1793 · angular/angular-cli
 https://github.com/angular/angular-cli/issues/1793

angularjs - Angular2 - Angular-CLI installing lodash - Cannot find module - Stack Overflow
 http://stackoverflow.com/questions/37712677/angular2-angular-cli-installing-lodash-cannot-find-module

Integrating lodash · Issue #1302 · AngularClass/angular2-webpack-starter
 https://github.com/AngularClass/angular2-webpack-starter/issues/1302

 angular2 - Angular 2 - How to bundle for production - Stack Overflow
  http://stackoverflow.com/questions/37631098/angular-2-how-to-bundle-for-production

```
$ npm install -g angular-cli
$ npm install -g protractor
$ webdriver-manager update
$ ng new foo-project
$ cd foo-project
$ npm install --save @angular/material
$ ng --version
angular-cli: 1.0.0-beta.24
node: 6.9.1
os: linux x64
@angular/common: 2.4.1
@angular/compiler: 2.4.1
@angular/core: 2.4.1
@angular/forms: 2.4.1
@angular/http: 2.4.1
@angular/material: 2.0.0-beta.1
@angular/platform-browser: 2.4.1
@angular/platform-browser-dynamic: 2.4.1
@angular/router: 3.4.1
@angular/compiler-cli: 2.4.1

$ npm install lodash --save
$ npm install @types/lodash --save-dev
$ npm start
$ ng build
$ ls -alh dist
total 11M
drwxrwxr-x 2 lin lin 4.0K Dec 29 17:53 .
drwxrwxr-x 6 lin lin 4.0K Dec 29 17:53 ..
-rw-rw-r-- 1 lin lin 5.4K Dec 29 17:53 favicon.ico
-rw-rw-r-- 1 lin lin  597 Dec 29 17:53 index.html
-rw-rw-r-- 1 lin lin 5.5K Dec 29 17:53 inline.bundle.js
-rw-rw-r-- 1 lin lin 5.5K Dec 29 17:53 inline.bundle.map
-rw-rw-r-- 1 lin lin  12K Dec 29 17:53 main.bundle.js
-rw-rw-r-- 1 lin lin 4.8K Dec 29 17:53 main.bundle.map
-rw-rw-r-- 1 lin lin 545K Dec 29 17:53 scripts.bundle.js
-rw-rw-r-- 1 lin lin 630K Dec 29 17:53 scripts.bundle.map
-rw-rw-r-- 1 lin lin  121 Dec 29 17:53 styles.bundle.css
-rw-rw-r-- 1 lin lin   94 Dec 29 17:53 styles.bundle.map
-rw-rw-r-- 1 lin lin 4.4M Dec 29 17:53 vendor.bundle.js
-rw-rw-r-- 1 lin lin 4.8M Dec 29 17:53 vendor.bundle.map
$ ng build --prod --aot
$ ls -alh dist
total 11M
drwxrwxr-x 2 lin lin 4.0K Dec 29 17:58 .
drwxrwxr-x 6 lin lin 4.0K Dec 29 17:58 ..
-rw-rw-r-- 1 lin lin 4.0K Dec 29 17:58 0.1c1c4746f849384e81bc.bundle.map
-rw-rw-r-- 1 lin lin 5.1K Dec 29 17:58 0.2debab58837be5565089.bundle.map
-rw-rw-r-- 1 lin lin 3.8K Dec 29 17:58 0.30687b655ad61a834eb2.bundle.map
-rw-rw-r-- 1 lin lin 2.9K Dec 29 17:58 0.333c0b68b2cccaa2356e.bundle.map
-rw-rw-r-- 1 lin lin  12K Dec 29 17:58 0.3b793a09d2470ac943d2.bundle.map
-rw-rw-r-- 1 lin lin 3.8K Dec 29 17:58 0.45de5e3f065776741223.bundle.map
-rw-rw-r-- 1 lin lin  13K Dec 29 17:58 0.4b855456456855eaaa45.bundle.map
-rw-rw-r-- 1 lin lin 3.3K Dec 29 17:58 0.4d4d258860364cf89174.bundle.map
-rw-rw-r-- 1 lin lin 7.1K Dec 29 17:58 0.645cc8e71285b4819785.bundle.map
-rw-rw-r-- 1 lin lin 3.5K Dec 29 17:58 0.65363472860bf341dd5d.bundle.map
-rw-rw-r-- 1 lin lin 6.7K Dec 29 17:58 0.68a157ef2a77f58645c4.bundle.map
-rw-rw-r-- 1 lin lin 4.5K Dec 29 17:58 0.7192db5b55f64425dc78.bundle.map
-rw-rw-r-- 1 lin lin 6.0K Dec 29 17:58 0.7e97e50878bb5a6dafdf.bundle.map
-rw-rw-r-- 1 lin lin 6.6K Dec 29 17:58 0.7f9a794486bdcf55ee45.bundle.map
-rw-rw-r-- 1 lin lin 3.4K Dec 29 17:58 0.81455422e136e2f73742.bundle.map
-rw-rw-r-- 1 lin lin 5.5K Dec 29 17:58 0.82951d36271d220ae03c.bundle.map
-rw-rw-r-- 1 lin lin 3.8K Dec 29 17:58 0.8698db03a580f631dfaa.bundle.map
-rw-rw-r-- 1 lin lin 2.8K Dec 29 17:58 0.89d58d4d91d1d19061b8.bundle.map
-rw-rw-r-- 1 lin lin 4.3K Dec 29 17:58 0.969852b8c702199bb6d7.bundle.map
-rw-rw-r-- 1 lin lin 3.4K Dec 29 17:58 0.96a49eee3a2d1aaa365c.bundle.map
-rw-rw-r-- 1 lin lin 9.6K Dec 29 17:58 0.9da2997d714552564b25.bundle.map
-rw-rw-r-- 1 lin lin 6.1K Dec 29 17:58 0.9e7ebde2d694a1b192a6.bundle.map
-rw-rw-r-- 1 lin lin 3.2K Dec 29 17:58 0.b27951335a3f1428f89f.bundle.map
-rw-rw-r-- 1 lin lin 5.3K Dec 29 17:58 0.bce46921e11d0f9a9334.bundle.map
-rw-rw-r-- 1 lin lin 4.9K Dec 29 17:58 0.cd68272ced2e0bbafef4.bundle.map
-rw-rw-r-- 1 lin lin 5.8K Dec 29 17:58 0.d81b58a93d1222b51c18.bundle.map
-rw-rw-r-- 1 lin lin  15K Dec 29 17:58 0.ddfb62fca9ea5c946fcc.bundle.map
-rw-rw-r-- 1 lin lin 6.1K Dec 29 17:58 0.eb5ed400796d3419f661.bundle.map
-rw-rw-r-- 1 lin lin 5.4K Dec 29 17:58 favicon.ico
-rw-rw-r-- 1 lin lin  702 Dec 29 17:58 index.html
-rw-rw-r-- 1 lin lin 1.5K Dec 29 17:58 inline.fd898ef909e0fad39096.bundle.js
-rw-rw-r-- 1 lin lin  14K Dec 29 17:58 inline.fd898ef909e0fad39096.bundle.map
-rw-rw-r-- 1 lin lin  52K Dec 29 17:58 main.c523fcb0cb1b7ba82c46.bundle.js
-rw-rw-r-- 1 lin lin 9.8K Dec 29 17:58 main.c523fcb0cb1b7ba82c46.bundle.js.gz
-rw-rw-r-- 1 lin lin 366K Dec 29 17:58 main.c523fcb0cb1b7ba82c46.bundle.map
-rw-rw-r-- 1 lin lin 545K Dec 29 17:58 scripts.c60ec2c098cadcd5e399.bundle.js
-rw-rw-r-- 1 lin lin  94K Dec 29 17:58 scripts.c60ec2c098cadcd5e399.bundle.js.gz
-rw-rw-r-- 1 lin lin 1.2M Dec 29 17:58 scripts.c60ec2c098cadcd5e399.bundle.map
-rw-rw-r-- 1 lin lin   62 Dec 29 17:58 styles.9239414b76e1ada4ee38.bundle.css
-rw-rw-r-- 1 lin lin  115 Dec 29 17:58 styles.9239414b76e1ada4ee38.bundle.map
-rw-rw-r-- 1 lin lin 1.3M Dec 29 17:58 vendor.3d775bbf1cfc9660c7c9.bundle.js
-rw-rw-r-- 1 lin lin 258K Dec 29 17:58 vendor.3d775bbf1cfc9660c7c9.bundle.js.gz
-rw-rw-r-- 1 lin lin 6.7M Dec 29 17:58 vendor.3d775bbf1cfc9660c7c9.bundle.map
```
