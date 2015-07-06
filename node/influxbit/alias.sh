DCP=influxbit
alias dc='docker-compose -p ${DCP}'
alias dcup='dc up -d --x-smart-recreate'
alias seed2sh='docker exec -i -t ${DCP}_seed_1'
alias keeper2sh='docker exec -i -t ${DCP}_keeper_1'
alias seed='seed2sh alpha-cli -conf=/btc/bitcoin.conf -rpcport=18332 -regtest=1'
alias keeper='keeper2sh alpha-cli -conf=/btc/bitcoin.conf -rpcport=18332 -regtest=1'
