build y12certs.min.js
```
$ npm install
$ npm run test
$ npm run build
```

### TODO

digitalbazaar/jsonld-signatures: An implementation of the Linked Data Signatures specification for JSON-LD. Works in the browser and node.js.
 https://github.com/digitalbazaar/jsonld-signatures

### v0.0.2

the hash of the local certificate(blockcerts.org)

Blockcerts : The Open Standard for Blockchain Certificates
 http://www.blockcerts.org/guide/verification-process.html

```
normalized = jsonld.normalize(certificate_json['document'],
    {'algorithm': 'URDNA2015', 'format': 'application/nquads'})
content_bytes = normalized.encode('utf-8')
local_hash = hashlib.sha256(content_bytes).hexdigest()
```

digitalbazaar/jsonld.js: A JSON-LD Processor and API implementation in JavaScript
 https://github.com/digitalbazaar/jsonld.js


### ref

version 0.0.1 Chainpoint CP1601 Y12JI - 十二義吉  https://y12ji.com/p/cp1601/
