examples/aws-node-fetch-file-and-store-in-s3 at master · serverless/examples
 https://github.com/serverless/examples/tree/master/aws-node-fetch-file-and-store-in-s3

 ```
 $ sls deploy

 Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading service .zip file to S3 (1.07 KB)...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...............
Serverless: Stack update finished...


Service Information
service: aws-fetch-btc
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/hello
functions:
  aws-fetch-btc-dev-hello: arn:aws:lambda:us-east-1:851160841508:function:aws-fetch-btc-dev-hello

$ sls invoke -f hello --log
  {
      "statusCode": 200,
      "body": "{\"raw\":{\"time\":{\"updated\":\"Dec 13, 2016 04:49:00 UTC\",\"updatedISO\":\"2016-12-13T04:49:00+00:00\",\"updateduk\":\"Dec 13, 2016 at 04:49 GMT\"},\"disclaimer\":\"This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org\",\"bpi\":{\"USD\":{\"code\":\"USD\",\"rate\":\"775.7463\",\"description\":\"United States Dollar\",\"rate_float\":775.7463},\"TWD\":{\"code\":\"TWD\",\"rate\":\"24,655.3958\",\"description\":\"New Taiwan Dollar\",\"rate_float\":24655.3958}}},\"btcusd\":776,\"btctwd\":24655,\"usdtwd\":31.78,\"msg\":\"Go Serverless v1.0! The current time is 04:49:50 GMT+0000 (UTC), shuffle.pick=3,5.\"}"
  }
  --------------------------------------------------------------------
  START RequestId: 94625e33-c0ef-11e6-90a0-b78c583701c2 Version: $LATEST
  2016-12-13 12:49:50.510 (+08:00)        94625e33-c0ef-11e6-90a0-b78c583701c2   { time:
     { updated: 'Dec 13, 2016 04:49:00 UTC',
       updatedISO: '2016-12-13T04:49:00+00:00',
       updateduk: 'Dec 13, 2016 at 04:49 GMT' },
    disclaimer: 'This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org',
    bpi:
     { USD:
        { code: 'USD',
          rate: '775.7463',
          description: 'United States Dollar',
          rate_float: 775.7463 },
       TWD:
        { code: 'TWD',
          rate: '24,655.3958',
          description: 'New Taiwan Dollar',
          rate_float: 24655.3958 } } }
  2016-12-13 12:49:50.527 (+08:00)        94625e33-c0ef-11e6-90a0-b78c583701c2   { statusCode: 200,
    body: '{"raw":{"time":{"updated":"Dec 13, 2016 04:49:00 UTC","updatedISO":"2016-12-13T04:49:00+00:00","updateduk":"Dec 13, 2016 at 04:49 GMT"},"disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org","bpi":{"USD":{"code":"USD","rate":"775.7463","description":"United States Dollar","rate_float":775.7463},"TWD":{"code":"TWD","rate":"24,655.3958","description":"New Taiwan Dollar","rate_float":24655.3958}}},"btcusd":776,"btctwd":24655,"usdtwd":31.78,"msg":"Go Serverless v1.0! The current time is 04:49:50 GMT+0000 (UTC), shuffle.pick=3,5."}' }
  END RequestId: 94625e33-c0ef-11e6-90a0-b78c583701c2
  REPORT RequestId: 94625e33-c0ef-11e6-90a0-b78c583701c2  Duration: 290.34 ms    Billed Duration: 300 ms  Memory Size: 1024 MB    Max Memory Used: 21 MB


$ curl -s https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/hello | python -m json.tool
{
    "btctwd": 24657,
    "btcusd": 776,
    "msg": "Go Serverless v1.0! The current time is 04:51:21 GMT+0000 (UTC), shuffle.pick=1,3.",
    "raw": {
        "bpi": {
            "TWD": {
                "code": "TWD",
                "description": "New Taiwan Dollar",
                "rate": "24,657.2631",
                "rate_float": 24657.2631
            },
            "USD": {
                "code": "USD",
                "description": "United States Dollar",
                "rate": "775.8050",
                "rate_float": 775.805
            }
        },
        "disclaimer": "This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
        "time": {
            "updated": "Dec 13, 2016 04:51:00 UTC",
            "updatedISO": "2016-12-13T04:51:00+00:00",
            "updateduk": "Dec 13, 2016 at 04:51 GMT"
        }
    },
    "usdtwd": 31.78
}
 ```
