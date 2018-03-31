from web3 import Web3, HTTPProvider
from time import sleep

'''
Remember to run `ganache-cli -p 7545`
'''
web3 = Web3(HTTPProvider('http://localhost:7545'))

def deploy_contract(**config):
    deployer = web3.personal.listAccounts[0]
    contract = web3.eth.contract(abi=config['abi'], bytecode=config['bytecode'])
    tx_hash = contract.constructor().transact(transaction={'from': deployer, 'gas': 910000})

    # Waiting for contract to be deployed
    i = 0
    while i < 5:
        try:
            # Get tx receipt to get contract address
            tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
            contract_address = tx_receipt['contractAddress']
            break  # if success, then exit the loop
        except:
            print("Reading failure for {} time(s)".format(i + 1))
            sleep(5+i)
            i = i + 1
            if i >= 5:
                 raise Exception("Cannot wait for contract to be deployed")

    if contract_address:
        print('Contract deployed at:', contract_address)

    contract_instance = web3.eth.contract(abi=config['abi'], address=contract_address)
    return contract_instance

# Details at https://github.com/ethereum/py-solc
from solc import compile_source
compile_source
contract_file = open('contracts/LazyLooseMoney.sol', 'r')
contract_code = contract_file.read()
contract_file.close()
compiled = compile_source(contract_code)
compiled_llm_factory = compiled['<stdin>:LlmFactory']
compiled_commitment = compiled['<stdin>:Commitment']
# print(compiled_commitment)

committer = web3.personal.listAccounts[1]
llm_factory = deploy_contract(abi=compiled_llm_factory['abi'], bytecode=compiled_llm_factory['bin'])
txn = llm_factory.functions.createCommitment("my commitment for next 30 days", 30).transact({'from': committer, 'value': web3.toWei(50000, 'gwei')})
commitment_address = llm_factory.functions.getLastCommitmentAddress().call()
print('Get commitment contract at', commitment_address)
commitment_contract = web3.eth.contract(abi = compiled_commitment['abi'], address = commitment_address)
print(commitment_contract.functions.getInfo().call())
