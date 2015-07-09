DCP=bitcorenode
alias dver='echo docker version: && docker version && docker-compose --version'
alias nver='echo -e "\nnode version:" && npm version'
alias ver='dver && nver'
alias dc='docker-compose -p ${DCP}'
alias dcrm='dc stop && dc rm'
alias dcup='dc up -d --x-smart-recreate'
