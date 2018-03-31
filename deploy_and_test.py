from web3 import Web3, HTTPProvider
from time import sleep

'''
Remember to run `ganache-cli -p 7545`
'''
web3 = Web3(HTTPProvider('http://localhost:7545'))

def wait_for_transaction(tx_hash):
    for i in range(0, 5):
        try:
            tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
            return tx_receipt
        except:
            print("Reading failure for {} time(s)".format(i + 1))
            sleep(5+i)
    raise Exception("Cannot wait for transaction")

def deploy_contract(**config):
    deployer = web3.personal.listAccounts[0]
    contract = web3.eth.contract(abi=config['abi'], bytecode=config['bytecode'])
    tx_hash = contract.constructor().transact(transaction={'from': deployer, 'gas': 910000})
    tx_receipt = wait_for_transaction(tx_hash)
    contract_address = tx_receipt['contractAddress']
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

llm_factory = deploy_contract(abi=compiled_llm_factory['abi'], bytecode=compiled_llm_factory['bin'])

committer = web3.personal.listAccounts[1]
title = "my commitment for next 30 days"
days = 30

tx_hash = llm_factory.functions.createCommitment(title, days).transact({'from': committer, 'value': web3.toWei(50000, 'gwei')})
tx_receipt = wait_for_transaction(tx_hash)

commitment_address = llm_factory.functions.getLastCommitmentAddress().call()
print('Get commitment contract at', commitment_address)

commitment_contract = web3.eth.contract(abi = compiled_commitment['abi'], address = commitment_address)
(_owner, _title, _days) = commitment_contract.functions.getInfo().call()
assert _owner == committer
assert _title == title
assert _days == days
