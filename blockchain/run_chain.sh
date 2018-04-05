# Ref https://github.com/f-o-a-m/cliquebait/blob/master/run.bash
geth --rpc --rpcaddr 127.0.0.1 --rpcport 8545 --rpcapi admin,debug,eth,miner,net,personal,shh,txpool,web3,ws --ws --wsaddr 127.0.0.1 --wsport 8546 --wsapi admin,debug,eth,miner,net,personal,shh,txpool,web3,ws --datadir ./chain_data --maxpeers 0 --networkid 1234 --port 30303 --nodiscover --mine --minerthreads 1
