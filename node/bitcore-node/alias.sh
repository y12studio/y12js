DCP=bitcorenode
alias ver='docker version && docker-compose --version'
alias dc='docker-compose -p ${DCP}'
alias dcrm='dc stop && dc rm'
alias dcup='dc up -d --x-smart-recreate'
