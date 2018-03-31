from web3 import Web3, HTTPProvider
from time import sleep
import binascii

'''
Remember to run `./run_chain.sh`
'''
web3 = Web3(HTTPProvider('http://localhost:8545'))

web3.personal.unlockAccount(web3.personal.listAccounts[0], 'demo')
web3.personal.unlockAccount(web3.personal.listAccounts[1], 'demo')
web3.personal.unlockAccount(web3.personal.listAccounts[2], 'demo')

ONE_ETH_IN_WEI = 10**18
web3.eth.sendTransaction({'value':ONE_ETH_IN_WEI,'to':web3.personal.listAccounts[0],'from':web3.eth.coinbase})
web3.eth.sendTransaction({'value':ONE_ETH_IN_WEI,'to':web3.personal.listAccounts[1],'from':web3.eth.coinbase})
web3.eth.sendTransaction({'value':ONE_ETH_IN_WEI,'to':web3.personal.listAccounts[2],'from':web3.eth.coinbase})


def wait_for_transaction(tx_hash):
    print('Waiting for tx_hash:', binascii.hexlify(tx_hash).decode('ascii'))
    for i in range(0, 8):
        try:
            tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
            if tx_receipt:
                return tx_receipt
            else:
                print("Reading failure for {} time(s)".format(i + 1))
                sleep(3+i)
        except:
            print("Reading failure for {} time(s)".format(i + 1))
            sleep(3+i)
    raise Exception("Cannot wait for transaction")

def deploy_contract(**config):
    deployer = web3.personal.listAccounts[0]
    contract = web3.eth.contract(abi=config['abi'], bytecode=config['bytecode'])
    # tx_hash = contract.deploy(transaction={'from': deployer})
    tx_hash = contract.constructor().transact(transaction={'from': deployer})
    tx_receipt = wait_for_transaction(tx_hash)
    # print('tx_receipt:', tx_receipt)
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


# Get new commitment_address from event
# http://web3py.readthedocs.io/en/latest/filters.html#event-log-filters
commitment_created_filter = llm_factory.eventFilter("CommitmentCreated", {'fromBlock': 0})
# commitment_created_filter = llm_factory.events.CommitmentCreated.createFilter(fromBlock=0)
last_events = commitment_created_filter.get_all_entries()
print(len(last_events), 'events found.')

committer = web3.personal.listAccounts[0]
title = "my commitment for next 30 days"
days = 30

deposit = web3.toWei(50000, 'gwei')
tx_hash = llm_factory.functions.createCommitment(title, days).transact({'from': committer, 'value': deposit})
tx_receipt = wait_for_transaction(tx_hash)

last_events = commitment_created_filter.get_new_entries()
print(len(last_events), 'events found.')
for event in last_events:
    # print(event)
	print(str(event.args.owner) + ": ", str(event.args.commitment) + ",", event.args.title)

# commitment_address = llm_factory.functions.getLastCommitmentAddress().call()
commitment_address = last_events[-1].args.commitment
print('Get commitment contract at', commitment_address)
commitment_contract = web3.eth.contract(abi = compiled_commitment['abi'], address = commitment_address)
(_owner, _title, _days) = commitment_contract.functions.getInfo().call()
print('found:', _title)
assert _owner == committer
assert _title == title
assert _days == days
assert web3.eth.getBalance(commitment_address) == deposit

filter = commitment_contract.eventFilter("fundAdded", {'fromBlock': 'latest'})
last_events = filter.get_new_entries()
print(len(last_events), 'events found.')
for event in last_events:
    print(event)

supporter = web3.personal.listAccounts[2]
supportValue = web3.toWei(1000, 'gwei')
encouragement = 'you can do it'
tx_hash = commitment_contract.functions.supportFund(encouragement).transact({'from': supporter, 'value': supportValue})
tx_receipt = wait_for_transaction(tx_hash)
assert web3.eth.getBalance(commitment_address) == deposit + supportValue
last_events = filter.get_new_entries()
# print(last_events)
assert last_events[-1].args.encouragement == encouragement
