# Lazy Loose Money

## Smart contract development environment setup
Install `python` and `web3py` beta
```
brew install python3
pip3 install --upgrade pip
pip install web3==4.0.0b13
```
install and run `geth`
```
brew tap ethereum/ethereum
brew install ethereum
```
### Init your local ethereum
Remember to run
```
cp run_chain.sh.example run_chain.sh
```
Then run bellow command three times
```
geth account new --password passwords.txt
```

You will get something like
```
Address: {833cdf83f94fd6fab42437767fd69082e2adefc9}
```

Get value within `{...}`, add `0x` to the account address header. For example: `0x833cdf83f94fd6fab42437767fd69082e2adefc9`

Then add newly created account addresses to `run_chain.sh`'s `--unlock ...` option. For example:
```
--unlock 0x6ab64ad9aa10269ac7ecde58875562a29109104e,0x259e9eab6e0b032e69b6cc75c41f7fc388d9cbdd,0x833cdf83f94fd6fab42437767fd69082e2adefc9
```
Then start geth server
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

### Stickk app
http://www.stickk.com/tour/3

It’s important to know what your goal is. **But it’s more important to know what it’ll take you to actually accomplish your goal.**

The possibility of losing money? A Referee who verifies your reports? Supporters who cheer you on along the way? Everyone’s different.

Stickk data shows that creating a Commitment Contract with:
* A Referee increases your chances of success by up to 2x
* Financial stakes increase your chances of success by up to 3x

What will it take for you?
