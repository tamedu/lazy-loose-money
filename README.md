# Lazy Loose Money

## Smart contract development environment setup
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

## References
### Web3py
http://web3py.readthedocs.io/en/latest

### solidity programming language
https://solidity.readthedocs.io/en/v0.4.21/

### BurnablePayment solidity contract
https://github.com/cryptoprimitive/contracts/blob/master/BurnablePayment.sol

Learn Factory pattern and burnable concept from the contract. Also learn how to struct my solidity code too :) Thanks [@coinop-logan](https://github.com/coinop-logan) to share the idea and introduce me to the blockchain world!

### Stickk app
http://www.stickk.com/tour/3

Stickk implemented the same idea. Can learn from it. Thanks [@joshpitzalis](https://github.com/joshpitzalis) to let me know.

> It’s important to know what your goal is. **But it’s more important to know what it’ll take you to actually accomplish your goal.**
>
> The possibility of losing money? A Referee who verifies your reports? Supporters who cheer you on along the way? Everyone’s different.
>
> Stickk data shows that creating a Commitment Contract with:
> * A Referee increases your chances of success by up to 2x
> * Financial stakes increase your chances of success by up to 3x
>
> What will it take for you?

### Create a virtualenv
Sometime you need to start from fresh, create a Python virtualenv is a good way to do it.
```
pip install virtualenv
virtualenv -p python3.6 --no-site-packages ~/my-venv
source ~/my-venv/bin/activate
```
