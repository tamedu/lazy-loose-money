/*
    llm utility functions
    use with Mist/MetaMask injected web3
*/

/* // https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api
window.promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) { console.log(err); reject(err); }
            resolve(res);
        })
    );
await window.promisify(() => console.log('hello')); // did not work! why?
*/

(function () {

window.llm = {
    /* config */
    // https://ropsten.etherscan.io/address/0x1e927cddb41e9347a47b23781a6a36e208575b73
    FactoryContractAddress: '0x1e927cddb41e9347a47b23781a6a36e208575b73',

    help() {
        console.log(`
[ General utilities ]
    llm.initWeb3(); // Init window.web3, llm.factoryContractInstance, llm.commimentContract
    llm.initAccounts(); // Need to run before call llm.accountInfo();
    llm.accountInfo(); // Get default account address and it's balance
    llm.createCommitment(data); // data = { title: '...', deposit: inWeiValue, daysCount: intValue }
        `);
        this.currentCommitment.help();
        this.guardingCommitment.help();
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
        this.factoryContractInstance = web3.eth.contract(this.abis.LlmFactory).at(this.FactoryContractAddress);
        this.commimentContract = web3.eth.contract(this.abis.Commitment);
    },

    createCommitment(data, func) {
        data.value = Math.round(parseFloat(data.deposit) * web3.toWei(1, 'ether'));
        console.log('Create commitment using data: ', data);
        this.factoryContractInstance.createCommitment(data.title,
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
        // var accounts = await window.promisify(cb => web3.eth.getAccounts(cb));

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.error(error);
            } else {
                console.log('Accounts:', accounts);
                if (func) { func(); }
            }
        });
    },

    isGuarding() {
        return !!this.guardingCommitment.getContractAddress();
    },
};

/* guardingCommitment utilities */
window.llm.guardingCommitment = {
    help() {
        console.log(`
[ guardingCommitment utilities ]
    llm.guardingCommitment.getContractAddress();
    llm.guardingCommitment.getContractInstant();
    llm.guardingCommitment.getInfo();
    llm.guardingCommitment.becomeGuardian();
    llm.guardingCommitment.report(completed); // Report today committer progress. completed = true or false
        `);
    },
    /*
        Use https://tamedu.github.io/lazy-loose-money/?guardingCommitment=0xd282007af28c3f8e46fdef6cb3fdb91dfafc2911
        to access the commitment you want to be guardian and to report committer daily progress
        the contract address is stored in `guardingCommitment` GET parameter
    */
    getContractAddress() {
        var m = window.location.href.match(/guardingCommitment=(0x([a-z0-9]){40})/);
        if (m) { return m[1]; }
    },
    getContractInstant() {
        this.contractInstance = window.llm.commimentContract.at(this.getContractAddress());
        console.log("Current commitment contract instant assigned to llm.currentCommitment.contractInstance");
        return this.contractInstance;
},
    getInfo(func) {
        window.llm.currentCommitment.contractInstance = window.llm.guardingCommitment.getContractInstant();
        window.llm.currentCommitment.getInfo(function () {
            window.llm.currentCommitment.contractInstance = null;
            if (func) { func(); }
        });
    },
    report(completed, func) {
        this.getContractInstant().report(completed, function (err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(res);
                if (func) { func(); }
            }
        });
    },
    becomeGuardian(data, func) {
        data.value = Math.round(parseFloat(data.guardianDeposit) * web3.toWei(1, 'ether'));
        console.log('Become guardian of: ', data);
        this.getContractInstant().becomeGuardian({'value': data.value }, function(err, res) {
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
window.llm.currentCommitment = {
    help() {
        console.log(`
[ currentCommitment utilities ]
    llm.currentCommitment.getContractInstant();
    llm.currentCommitment.getInfo();
    llm.currentCommitment.cancel();
    llm.currentCommitment.commit();
        `);
    },
    contractInstance: null,
    commit(func) {
        this.contractInstance.commit(function (err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(res);
                if (func) { func(); }
            }
        });
    },
    cancel(func) {
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
        window.llm.factoryContractInstance.getCurrentCommitmentAddress(function(err, res) {
            if (err) {
                console.log(err.message);
            } else {
                console.log('Current commitment address:', res);
                window.llm.currentCommitment.contractInstance = window.llm.commimentContract.at(res);
                console.log("Current commitment contract instant assigned to llm.currentCommitment.contractInstance");
                if (func) { func(window.llm.currentCommitment.contractInstance); }
                return this.contractInstance;
            }
        });
    },

    getInfo(func) {
        if (this.contractInstance == null) {
            console.log("Run llm.currentCommitment.getContractInstant() first");
            return;
        }
        this.contractInstance.getInfo(function (err, res) {
            if (err) {
                console.log(err.message);
            } else {
                currentCommitment = {
                    title:  res[1],
                    deposit: res[2].toNumber() / web3.toWei(1, 'ether'),
                    guardianDeposit: res[3].toNumber() / web3.toWei(1, 'ether'),
                    daysCount: res[4].toNumber(),
                    state: window.llm.State[res[5].toNumber()],
                    guardian: res[8],
                    startedAt: new Date(res[6].toNumber()*1000),
                    finishedAt: new Date(res[7].toNumber()*1000),
                };

                var events = llm.currentCommitment.contractInstance.Reported({fromBlock: 0, toBlock: 'latest'});
                // would get all past logs again.
                events.get(function(err, logs) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log(logs);
                        currentCommitment.reports = logs;
                    }
                });

                console.log("Current commitment: ", currentCommitment);
                if (func) { func(currentCommitment); }
            }
        });
    },
};

/* data */

window.llm.State = [
    'Opened',
    'Guarded',
    'Started',
    'Pending',
    'Closed'
];

/* run `solc --abi LazyLooseMoney.sol` to get the ABI jsons */
window.llm.abis = {
    // ======= contracts/LazyLooseMoney.sol:Commitment =======
    Commitment: [{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"encouragement","type":"string"}],"name":"supportFund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"commit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"guardian","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"title","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint8"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"release","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"completed","type":"bool"}],"name":"report","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"supportersFunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"becomeGuardian","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_title","type":"string"},{"name":"_days","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"daysCount","type":"uint256"},{"indexed":false,"name":"createdAt","type":"uint256"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"supporter","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"encouragement","type":"string"},{"indexed":false,"name":"fundedAt","type":"uint256"}],"name":"fundAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"startedAt","type":"uint256"},{"indexed":false,"name":"finishedAt","type":"uint256"}],"name":"Started","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"guardian","type":"address"},{"indexed":false,"name":"guardianDeposit","type":"uint256"},{"indexed":false,"name":"guardedAt","type":"uint256"}],"name":"Guarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"guardian","type":"address"},{"indexed":false,"name":"completed","type":"bool"},{"indexed":false,"name":"reportedAt","type":"uint256"}],"name":"Reported","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"commitment","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"dayscount","type":"uint256"},{"indexed":false,"name":"reportedDays","type":"uint256"},{"indexed":false,"name":"completedDays","type":"uint256"},{"indexed":false,"name":"ownerReward","type":"uint256"},{"indexed":false,"name":"guardianReward","type":"uint256"},{"indexed":false,"name":"closedAt","type":"uint256"}],"name":"Closed","type":"event"}],

    // ======= contracts/LazyLooseMoney.sol:LlmFactory =======
    LlmFactory: [{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_days","type":"uint256"}],"name":"createCommitment","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"commitments","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentCommitmentAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"currentCommitment","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getLastCommitmentAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"commitment","type":"address"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"daysCount","type":"uint256"},{"indexed":false,"name":"createdAt","type":"uint256"}],"name":"CommitmentCreated","type":"event"}],
};

})();
