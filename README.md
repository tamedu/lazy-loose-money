## Lazy Loose Money

## vyper & web3py setup
### Install python3 and dependencies
```
brew install python3 gmp
pip3 install --upgrade pip
pip3 install virtualenv
```
### Create a separate environment and active it
```
virtualenv -p python3.6 --no-site-packages ~/vyper-web3-venv
source ~/vyper-web3-venv/bin/activate
```

### Install vyper from source
```
git clone https://github.com/ethereum/vyper.git
cd vyper
make
make test
```

### Use vyper
```
cd lazy-loose-money/vyper-contracts
vyper lazy_loose_money.v.py
pytest test_lazy_loose_money.py
```

### Install web3py
```
pip install -r requirements.txt
# install and run `ganache-cli` (goolge if needed)
python3 llm.py
```

## Reference

http://www.stickk.com/tour/3

The possibility of losing money? A Referee who verifies your reports? Supporters who cheer you on along the way? Everyone’s different.

Stickk data shows that creating a Commitment Contract with:
* A Referee increases your chances of success by up to 2x
* Financial stakes increase your chances of success by up to 3x

What will it take for you?
