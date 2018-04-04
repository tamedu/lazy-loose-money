/*
    llm utility functions
    use with Mist/MetaMask injected web3
*/

llm = {
    help() {
        console.log("\n[ General utilities ]")
        console.log("llm.initWeb3();\nllm.initAccounts();\nllm.accountInfo();\nllm.createCommitment();");

        console.log("\n[ currentCommitment utilities ]");
        llm.currentCommitment.help();

        console.log("\n[ guardingCommitment utilities ]");
        llm.guardingCommitment.help();
    },

    /* general utilities */
    initWeb3() {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== "undefined") {
          // Use Mist/MetaMask's provider
          window.web3 = new Web3(web3.currentProvider);
        } else {
          console.log("No web3? You should consider trying MetaMask!");
        }
        llm.factoryContractInstance = web3.eth.contract(llm.abis.LlmFactory).at(llm.FactoryContractAddress);
        llm.commimentContract = web3.eth.contract(llm.abis.Commitment);
    },

    createCommitment(data, func) {
        var value = Math.round(parseFloat(data.deposit) * web3.toWei(1, 'ether'));
        llm.factoryContractInstance.createCommitment(data.title,
            parseInt(data.daysCount), {'value': data.value }, function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(res);
            if (func) { func(); }
          }
      });
    },

    accountInfo(func) {
        var accountAddress = web3.eth.defaultAccount;
        web3.eth.getBalance(accountAddress, function(error, balance) {
            if (error) {
                console.error(error);
            } else {
                var balanceInEthers = balance.toNumber() / web3.toWei(1, 'ether');
                console.log("Acccount " + accountAddress + " has " + balanceInEthers);
                if (func) { func(accountAddress, balanceInEthers); }
            }
        });
    },

    initAccounts(func) {
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.error(error);
            } else {
                console.log(accounts);
                if (func) { func(); }
            }
        });
    },

    /* data */

    State: [
        'Opened',
        'Guarded',
        'Started',
        'Pending',
        'Closed'
    ],
    // https://ropsten.etherscan.io/address/0xabc89d6e0569f9ee41d3a716b66b956d189d084a
    FactoryContractAddress: '0xabc89d6e0569f9ee41d3a716b66b956d189d084a',
    /* run `solc --abi contracts/LazyLooseMoney.sol` to get the ABI jsons */
    abis: {
        // ======= contracts/LazyLooseMoney.sol:Commitment =======
        Commitment: [{"constant":false,"inputs":[{"name":"encouragement","type":"string"}],"name":"supportFund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"commit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"guardian","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"title","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint8"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"release","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"beGuardian","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"completed","type":"bool"}],"name":"report","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"supportersFunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_title","type":"string"},{"name":"_days","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"createdAt","type":"uint256"},{"indexed":false,"name":"daysCount","type":"uint256"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"supporter","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"encouragement","type":"string"}],"name":"fundAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"startedAt","type":"uint256"},{"indexed":false,"name":"finishedAt","type":"uint256"}],"name":"Started","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"guardian","type":"address"},{"indexed":false,"name":"guardianDeposit","type":"uint256"},{"indexed":false,"name":"guardedAt","type":"uint256"}],"name":"Guarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"guardian","type":"address"},{"indexed":false,"name":"completed","type":"bool"},{"indexed":false,"name":"reportedAt","type":"uint256"}],"name":"Reported","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"dayscount","type":"uint256"},{"indexed":false,"name":"reportedDays","type":"uint256"},{"indexed":false,"name":"completedDays","type":"uint256"},{"indexed":false,"name":"ownerReward","type":"uint256"},{"indexed":false,"name":"guardianReward","type":"uint256"},{"indexed":false,"name":"closedAt","type":"uint256"}],"name":"Closed","type":"event"}],

        // ======= contracts/LazyLooseMoney.sol:LlmFactory =======
        LlmFactory: [{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_days","type":"uint256"}],"name":"createCommitment","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"commitments","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentCommitmentAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getLastCommitmentAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"commitment","type":"address"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"daysCount","type":"uint256"}],"name":"CommitmentCreated","type":"event"}],
    }
};

/* guardingCommitment utilities */
llm.guardingCommitment = {
    help() {
        console.log("llm.guardingCommitment.getContractAddress(); \nllm.guardingCommitment.getContractInstant();\nllm.guardingCommitment.getInfo();\nllm.guardingCommitment.report()");
    },
    /*
        Use https://tamedu.github.io/lazy-loose-money/?guardingCommitment=0xd282007af28c3f8e46fdef6cb3fdb91dfafc2911
        to access the commitment you want to be guardian and to report committer daily progress
        the contract address is stored in `guardingCommitment` GET parameter
    */
    getContractAddress() {
        return window.location.href.match(/guardingCommitment=(0x([a-z0-9]){40})/)[1]
    },
    getContractInstant() {
        this.contractInstance = llm.commimentContract.at(this.getContractAddress());
        console.log("Current commitment contract instant assigned to llm.currentCommitment.contractInstance");
        return this.contractInstance;
},
    getInfo(func) {
        llm.currentCommitment.contractInstance = llm.guardingCommitment.getContractInstant();
        llm.currentCommitment.getInfo(func);
        llm.currentCommitment.contractInstance = null;
    },
    report(completed, func) {
        llm.guardingCommitment.getContractInstant().report(completed, function (err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(res);
                if (func) { func(); }
            }
        });
    },
};

/* currentCommitment utilities */
llm.currentCommitment = {
    help() {
        console.log("llm.currentCommitment.getContractInstant(); \nllm.currentCommitment.getInfo();\nllm.currentCommitment.cancel()");
    },
    contractInstance: null,
    cancel(func) {
        if (this.contractInstance == null) {
            console.log("Run llm.currentCommitment.getContractInstant() first");
            return;
        }
        this.contractInstance.cancel(function (err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(res);
                if (func) { func(); }
            }
        });

    },
    getContractInstant(func) {
        llm.factoryContractInstance.getCurrentCommitmentAddress(function(err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(res);
                llm.currentCommitment.contractInstance = llm.commimentContract.at(res);
                console.log("Current commitment contract instant assigned to llm.currentCommitment.contractInstance");
                if (func) { func(llm.currentCommitment.contractInstance); }
                return this.contractInstance;
            }
        });
    },

    getInfo(func) {
        if (this.contractInstance == null) {
            console.log("Run llm.currentCommitment.getContractInstant() first");
            return;
        }
        console.log(this.contractInstance);
        this.contractInstance.getInfo(function (err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(res);
                currentCommitment = {
                    title:  res[1],
                    deposit: res[2].toNumber() / web3.toWei(1, 'ether'),
                    daysCount: res[4].toNumber(),
                    state: llm.State[res[5].toNumber()],
                };
                console.log("Current commitment: ", currentCommitment);
                if (func) { func(currentCommitment); }
            }
        });
    },
};
