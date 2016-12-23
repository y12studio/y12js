## TODO

Post tutorial on transferring name from the Onename app to the CLI blockstack/blockstack-cli
https://github.com/blockstack/blockstack-cli/issues/94

## LOG

Blockstack - Docs
https://blockstack.org/docs

```
$ sudo pip install blockstack
$ blockstack -h
...
Blockstack cli version 0.14.0.7
$ blockstack lookup y12.id
...
$ blockstack price y12.id
{
    "name_price": {
        "btc": "0.016",
        "satoshis": "1600000"
    },
    "preorder_tx_fee": {
        "btc": "0.00047052",
        "satoshis": "47052"
    },
    "register_tx_fee": {
        "btc": "0.00047052",
        "satoshis": "47052"
    },
    "total_estimated_cost": {
        "btc": "0.01788207",
        "satoshis": "1788207"
    },
    "update_tx_fee": {
        "btc": "0.00094103",
        "satoshis": "94103"
    },
    "warnings": [
        "Wallet not accessed; fees are rough estimates."
    ]
}
$ blockstack price y12ji.id
{
    "name_price": {
        "btc": "0.001",
        "satoshis": "100000"
    },
    "preorder_tx_fee": {
        "btc": "0.00047053",
        "satoshis": "47053"
    },
    "register_tx_fee": {
        "btc": "0.00047053",
        "satoshis": "47053"
    },
    "total_estimated_cost": {
        "btc": "0.00288212",
        "satoshis": "288212"
    },
    "update_tx_fee": {
        "btc": "0.00094106",
        "satoshis": "94106"
    },
    "warnings": [
        "Wallet not accessed; fees are rough estimates."
    ]
}

```
