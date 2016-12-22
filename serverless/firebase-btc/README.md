examples/aws-node-fetch-file-and-store-in-s3 at master · serverless/examples
 https://github.com/serverless/examples/tree/master/aws-node-fetch-file-and-store-in-s3

```
$ cp aws-fetch-btc
$ npm test
$ sls deploy
$ sls invoke -f hello --log
$ curl -s https://xxxxx.execute-api.ap-northeast-1.amazonaws.com/dev/hello | python -m json.tool
 ```

http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format

```
{
    "resource": "Resource path",
    "path": "Path parameter",
    "httpMethod": "Incoming request's method name"
    "headers": {Incoming request headers}
    "queryStringParameters": {query string parameters }
    "pathParameters":  {path parameters}
    "stageVariables": {Applicable stage variables}
    "requestContext": {Request context, including authorizer-returned key-value pairs}
    "body": "A string of the request payload."
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
}
```
