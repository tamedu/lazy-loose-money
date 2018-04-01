## Python smart contract development environment setup
Install `python`, `web3py` beta and `py-solc`
```
brew tap ethereum/ethereum
brew install python3 solidity
pip3 install --upgrade pip
pip install web3==4.0.0b13
pip install py-solc
```
install and run `geth`
```
brew tap ethereum/ethereum
brew install ethereum
```
### Init your local ethereum for the first time
```
./init_chain.sh
```

### Start `geth` server to deploy and test
Start geth server
```
./run_chain.sh
```

Then run
```
python3 deploy_and_test.py
```

### Start the HTML app
```
python -m SimpleHTTPServer
open http://localhost:8000/
```

### Create a virtualenv
Sometime you need to start from fresh, create a Python virtualenv is a good way to do it.
```
pip install virtualenv
virtualenv -p python3.6 --no-site-packages ~/my-venv
source ~/my-venv/bin/activate
```
