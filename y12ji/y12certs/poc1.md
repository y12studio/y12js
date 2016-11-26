blockchain-certificates/cert-issuer: Issues digital certificates using the Bitcoin blockchain
 https://github.com/blockchain-certificates/cert-issuer

install

```
$git clone https://github.com/blockchain-certificates/cert-issuer.git && cd cert-issuer
$docker build -t ml/cert-issuer:1.0 .
$docker run -it ml/cert-issuer:1.0 bash
```

bash in docker instance.

```
(env) root@4ecb6ac6579d:/# issuer=`bitcoin-cli getnewaddress`
(env) root@4ecb6ac6579d:/# echo $issuer
mgtt7icvm7RDAxk7Li6TNHSbXV836heJ4A
(env) root@4ecb6ac6579d:/# sed -i.bak "s/<issuing-address>/$issuer/g" /etc/cert-issuer/conf.ini
(env) root@4ecb6ac6579d:/# cat /etc/cert-issuer/conf.ini
issuing_address = mgtt7icvm7RDAxk7Li6TNHSbXV836heJ4A
revocation_address = <revocation-address>

wallet_connector_type = bitcoind
bitcoin_chain=regtest

usb_name=/etc/cert-issuer/
key_file=pk_issuer.txt

no_safe_mode
no_transfer_from_storage_address

data_path=/etc/cert-issuer/data
archive_path=/etc/cert-issuer/archive
(env) root@4ecb6ac6579d:/# bitcoin-cli dumpprivkey $issuer > /etc/cert-issuer/pk_issuer.txt
(env) root@4ecb6ac6579d:/# cat /etc/cert-issuer/pk_issuer.txt
cPHbf8F12XDr2UDXnGHgjua38pjy83ZqX6YaF1prfWCb4PsHrz5y

(env) root@4ecb6ac6579d:/# revocation=`bitcoin-cli getnewaddress`
(env) root@4ecb6ac6579d:/# sed -i.bak "s/<revocation-address>/$revocation/g" /etc/cert-issuer/conf.ini

(env) root@4ecb6ac6579d:/# cat /etc/cert-issuer/conf.ini
issuing_address = mgtt7icvm7RDAxk7Li6TNHSbXV836heJ4A
revocation_address = mx4kAjdEaB5nJLAmG3xWrtCCmR9Qwxm7iP

wallet_connector_type = bitcoind
bitcoin_chain=regtest

usb_name=/etc/cert-issuer/
key_file=pk_issuer.txt

no_safe_mode
no_transfer_from_storage_address

data_path=/etc/cert-issuer/data
archive_path=/etc/cert-issuer/archive
```

cert-issuer/6c6bd2ec-d0d6-41a9-bec8-57bb904c62a8.json at master · blockchain-certificates/cert-issuer
 https://github.com/blockchain-certificates/cert-issuer/blob/master/examples/data-testnet/unsigned_certs/6c6bd2ec-d0d6-41a9-bec8-57bb904c62a8.json

```
(env) root@4ecb6ac6579d:/# cp /cert-issuer/examples/data-testnet/unsigned_certs/6c6bd2ec-d0d6-41a9-bec8-57bb904c62a8.json /etc/cert-issuer/data/unsigned_certs/

(env) root@4ecb6ac6579d:/# bitcoin-cli generate 101
(env) root@4ecb6ac6579d:/# bitcoin-cli getbalance
50.00000000
(env) root@4ecb6ac6579d:/# bitcoin-cli sendtoaddress $issuer 5
826a68eccf13875428953bdf7b2032539a0e363bd0e422036e1e863cd9e92cfb

```
