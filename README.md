https://tamedu.github.io/lazy-loose-money

Running on `Ropsten Testnet`, contract address [0x34bdced976429993238aeb44347a8f9ce23d25d2](https://ropsten.etherscan.io/address/0x34bdced976429993238aeb44347a8f9ce23d25d2)

# Lazy Loose Money

Let say that i want to do running for 1 hour everyday for 100 days. I create a contract and deposit $100 in it. Everyday, I need to (somehow) inform the contract that I finish my running or not. Then after 100 days passed, depend on the completeness of my report, the contract will do some punishment. For example: lock $100 for 10 more-day for each day I did not do the running. So if I skip running for 6 day, the money will be lock there for 2-months. Other kinds of punishment could be: Burn a part of deposit money, give it to someone ...

I'm thinking of asking a friend (roommate for example) to do the checking for me. And how should I incentive my friend to inform the contract regularly and CORRECTLY?

**Here is a solution**

* If I cancel my commitment, I will part of my deposit money.

* If I keep my commitment contract run till the end:

    - My friend will get a portion of deposit money according to the number of days reported to the contract.

    - I will get back a portion of deposit money according to the number of days I finished my commitment.


Later, we can add more features:

* Supporters can visit and give the commitment some fund. Supporters are there to __encourage__ I and my guardian finishing the commitment. The main purpose is to say __nice words__ to make keep moving forward. Any fund supporters added should be treated as tip moneys (small amount)

* I can blame the guardian (did not report correctly, ...) and both I him will loose money to make sure I won't false blame to get back more money

* More than one person can be guardians, and guradians can co-report me commitment. The more guradians join, the stronger my committent is

* Link with real data. See https://github.com/Cryptizens/cryptorun-back for example ![alt text](https://s3.eu-central-1.amazonaws.com/cryptorun.be/cryptorun-architecture.png "Back-end architecture")


## More game theory
To avoid troll guardian (not implemented yet):
* Guardian need to deposit some money
* committer can `complain` if guardian reported wrongly. In this case both committer and guardian loose money
* After complain for 3 times, committer can `fire` his guardian to find a more realiable one

## Smart contract development and deployment
Copy Solidity code from `LazyLooseMoney.sol` and paste it to http://remix.ethereum.org

## JavaScript CLI tools
```
# Open the HTML app in Chrome
open https://tamedu.github.io/lazy-loose-money/
# Press Ctrl + Shift + J (Windows / Linux) or Cmd + Opt + J (Mac)
# to open Chrome DevTools Console
llm.help()
```

## References
### Web3js (the version injected by Mist/MetaMask)
https://github.com/ethereum/wiki/wiki/JavaScript-API

### Solidity programming language
https://solidity.readthedocs.io/en/v0.4.21/

### BurnablePayment solidity contract
https://github.com/cryptoprimitive/contracts/blob/master/BurnablePayment.sol

Learn Factory pattern and burnable concept from the contract. Also learn how to struct my solidity code too :) Thanks [@coinop-logan](https://github.com/coinop-logan) to share the idea and introduce me to the blockchain world!

### Vuejs: My Automatic View ^_^
https://vuejs.org/v2/guide/

### tachyons: styling your HTML without touching CSS code :)
http://tachyons.io/

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
