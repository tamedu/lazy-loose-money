from web3 import Web3, HTTPProvider
from vyper import compiler
from web3.contract import ConciseContract
from time import sleep

contract_file = open('lazy_loose_money.v.py', 'r')
contract_code = contract_file.read()
contract_file.close()

cmp = compiler.Compiler()
contract_bytecode = cmp.compile(contract_code).hex()
contract_abi = cmp.mk_full_signature(contract_code)

'''
Run `ganach-cli`
'''
web3 = Web3(HTTPProvider('http://localhost:8545'))
# print(web3.personal.listAccounts)
deployer = web3.personal.listAccounts[0]
contract = web3.eth.contract(abi=contract_abi, bytecode=contract_bytecode)
tx_hash = contract.deploy(transaction={'from': deployer, 'gas': 410000})

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

# Contract instance in concise mode
# contract_instance = web3.eth.contract(abi=contract_abi, address=contract_address, ContractFactoryClass=ConciseContract)
contract_instance = web3.eth.contract(abi=contract_abi, address=contract_address)

# Calling contract method
print('Contract version number: {}'.format(contract_instance.call().version()))
