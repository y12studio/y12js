Getting Started with MultiChain
 http://www.multichain.com/getting-started/

Create a Private Blockchain in 90 Seconds | Make Bitcoin Great Again
 https://makebitcoingreatagain.wordpress.com/2015/11/26/create-a-private-blockchain-in-90-seconds/

```
$ docker -v
Docker version 1.9.1, build a34a1d5
$ docker-compose -v
docker-compose version: 1.5.1
$ source alias.sh
$ dc up -d
$ dc ps
Name            Command      State   Ports
------------------------------------------------
mchain_alice_1     /sbin/my_init   Up
mchain_bob_1       /sbin/my_init   Up
mchain_chain_1     /sbin/my_init   Up
mchain_charlie_1   /sbin/my_init   Up
```
chain node
```
$ chain2sh bash
# /mc/multichain-util create xch
MultiChain utilities build 1.0 alpha 12 protocol 10002

Network parameter set was successfully generated.
You can edit it in /root/.multichain/xch/params.dat before running multichaind for the first time.

To generate network please run "multichaind xch".
# /mc/multichaind xch -daemon
MultiChain Core Daemon build 1.0 alpha 12 protocol 10002

Multichain server starting
# Looking for genesis block...
Genesis block found
New users can connect to this blockchain using
multichaind xch@172.17.42.5:7751

Node started
// grant alice
# /mc/multichain-cli xch grant 1agMcSrrnAELvipX3K9U7WTwJjxVcHXA7EVdYi connect,send,receive
{"method":"grant","params":["1agMcSrrnAELvipX3K9U7WTwJjxVcHXA7EVdYi","connect,send,receive"],"id":1,"chain_name":"xch"}

165213e0d256b3214c5cbf958fc55e93a0e33df2650fc86965fecd9ac949ff4b

# /mc/multichain-cli xch getinfo
{"method":"getinfo","params":[],"id":1,"chain_name":"xch"}

{
    "version" : "1.0 alpha 12",
    "protocolversion" : 10002,
    "chainname" : "xch",
    "description" : "Multichain network xch",
    "protocol" : "multichain",
    "port" : 7751,
    "setupblocks" : 60,
    "nodeaddress" : "xch@172.17.42.5:7751",
    "walletversion" : 60000,
    "balance" : 0.00000000,
    "blocks" : 75,
    "timeoffset" : 0,
    "connections" : 1,
    "proxy" : "",
    "difficulty" : 0.00001526,
    "testnet" : false,
    "keypoololdest" : 1448594429,
    "keypoolsize" : 2,
    "paytxfee" : 0.00000000,
    "relayfee" : 0.00000000,
    "errors" : ""
}

#/mc/multichain-cli xch listpermissions issue
{"method":"listpermissions","params":["issue"],"id":1,"chain_name":"xch"}

[
    {
        "address" : "1WAGztzwKANX9Q2Unue9igs6KqJ6jyndFP4aAW",
        "type" : "issue",
        "startblock" : 0,
        "endblock" : 4294967295
    }
]
#/mc/multichain-cli xch issue 1WAGztzwKANX9Q2Unue9igs6KqJ6jyndFP4aAW Y12Asset 1000 0.01
{"method":"issue","params":["1WAGztzwKANX9Q2Unue9igs6KqJ6jyndFP4aAW","Y12Asset",1000,0.01000000],"id":1,"chain_name":"xch"}

16affaf3dae4799914d23f56a0d3e67fc467e891c1ee16a0b14269879095abc6
# /mc/multichain-cli xch listassets
{"method":"listassets","params":[],"id":1,"chain_name":"xch"}

[
    {
        "name" : "Y12Asset",
        "genesistxid" : "16affaf3dae4799914d23f56a0d3e67fc467e891c1ee16a0b14269879095abc6",
        "assetref" : "145-266-44822",
        "multiple" : 100,
        "units" : 0.01000000,
        "details" : {
        },
        "issueqty" : 1000.00000000,
        "issueraw" : 100000
    }
]

# /mc/multichain-cli xch sendassettoaddress 1NyFactcQb3xcFLWGh24TAmVJdbbijrx8kGHMG Y12Asset 199
{"method":"sendassettoaddress","params":["1NyFactcQb3xcFLWGh24TAmVJdbbijrx8kGHMG","Y12Asset",199],"id":1,"chain_name":"xch"}

error: {"code":-5,"message":"Destination address doesn't have receive permission"}
# /mc/multichain-cli xch grant 1NyFactcQb3xcFLWGh24TAmVJdbbijrx8kGHMG receive,send
{"method":"grant","params":["1NyFactcQb3xcFLWGh24TAmVJdbbijrx8kGHMG","receive,send"],"id":1,"chain_name":"xch"}

8df9a1ca41c706193be873c250a32e1f9d007e42944d192d59dca684127c2bf2

# /mc/multichain-cli xch sendassettoaddress 1NyFactcQb3xcFLWGh24TAmVJdbbijrx8kGHMG Y12Asset 199
{"method":"sendassettoaddress","params":["1NyFactcQb3xcFLWGh24TAmVJdbbijrx8kGHMG","Y12Asset",199],"id":1,"chain_name":"xch"}

e3b88a61b3e5bca6f4ffa5a74ae7c16c96499b29884782e228130f4d91c1102a
# /mc/multichain-cli xch gettotalbalances 0
{"method":"gettotalbalances","params":[0],"id":1,"chain_name":"xch"}

[
    {
        "name" : "Y12Asset",
        "assetref" : "145-266-44822",
        "qty" : 801.00000000
    }
]

```
alice node
```
$ alice2sh bash
# /mc/multichaind xch@172.17.42.5:7751
MultiChain Core Daemon build 1.0 alpha 12 protocol 10002

Retrieving network parameters from the seed node 172.17.42.5:7751 ...
Network successfully initialized.

Please ask network admin to let you connect and/or transact:
multichain-cli xch grant 1agMcSrrnAELvipX3K9U7WTwJjxVcHXA7EVdYi connect
multichain-cli xch grant 1agMcSrrnAELvipX3K9U7WTwJjxVcHXA7EVdYi connect,send,receive

// wait for chain node
# /mc/multichaind xch -daemon
MultiChain Core Daemon build 1.0 alpha 12 protocol 10002

Multichain server starting
root@ba4886abd401:/# Retrieving network parameters from the seed node 172.17.42.5:7751 ...
New users can connect to this blockchain using
multichaind xch@172.17.42.4:7751

Node started

# /mc/multichain-cli xch getinfo
{"method":"getinfo","params":[],"id":1,"chain_name":"xch"}

{
    "version" : "1.0 alpha 12",
    "protocolversion" : 10002,
    "chainname" : "xch",
    "description" : "Multichain network xch",
    "protocol" : "multichain",
    "port" : 7751,
    "setupblocks" : 60,
    "nodeaddress" : "xch@172.17.42.4:7751",
    "walletversion" : 60000,
    "balance" : 0.00000000,
    "blocks" : 79,
    "timeoffset" : 0,
    "connections" : 1,
    "proxy" : "",
    "difficulty" : 0.00001526,
    "testnet" : false,
    "keypoololdest" : 1448594701,
    "keypoolsize" : 2,
    "paytxfee" : 0.00000000,
    "relayfee" : 0.00000000,
    "errors" : ""
}
# /mc/multichain-cli xch getnewaddress
{"method":"getnewaddress","params":[],"id":1,"chain_name":"xch"}

1NyFactcQb3xcFLWGh24TAmVJdbbijrx8kGHMG

# /mc/multichain-cli xch gettotalbalances 0

{"method":"gettotalbalances","params":[0],"id":1,"chain_name":"xch"}

[
    {
        "name" : "Y12Asset",
        "assetref" : "145-266-44822",
        "qty" : 199.00000000
    }
]

```
