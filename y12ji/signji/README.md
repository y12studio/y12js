Install

```
$ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ node --version
v4.2.2
$ node app.js --serinline
$ sha256sum hc1501app-0.0.1.html
4897a8acc3f474fa02c98f2194557f7bdd2255ccfbfd88f623ceebc5de25565f  hc1501app-0.0.1.html
$ curl https://www.blocktrail.com/BTC/tx/8dc7f5a1eca16d597e8d49867ccb8d4f7a12a1fea4602b8b820de3b3f4a55a6e
OP_RETURN 5931324a494843314897a8acc3f474fa02c98f2194557f7bdd2255ccfbfd88f623ceebc5de25565f
5931324a49 + 4843314897a8acc3f474fa02c98f2194557f7bdd2255ccfbfd88f623ceebc5de25565f
Y12JIHC1 + sha256sum hc1501app-0.0.1.html
```

ref

remy/inliner https://github.com/remy/inliner

Fixed -n argument. Dont uglify when -n. Added option to inline min js files by pescuma · Pull Request #67 · remy/inliner
 https://github.com/remy/inliner/pull/67

pescuma/inliner
 https://github.com/pescuma/inliner

 jrit/web-resource-inliner
  https://github.com/jrit/web-resource-inliner
