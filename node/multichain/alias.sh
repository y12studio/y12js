DCP=mchain
alias dc='docker-compose -p ${DCP}'
alias chain2sh='docker exec -i -t ${DCP}_chain_1'
alias alice2sh='docker exec -i -t ${DCP}_alice_1'
alias bob2sh='docker exec -i -t ${DCP}_bob_1'
alias chaincli='chain2sh multichain-cli'
alias alicecli='alice2sh multichain-cli'
