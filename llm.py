from deploy_contracts import *

contract_file = open('vyper-contracts/lazy_loose_money.v.py', 'r')
contract_code = contract_file.read()
contract_file.close()

cmp = compiler.Compiler()
contract_bytecode = cmp.compile(contract_code).hex()
contract_abi = cmp.mk_full_signature(contract_code)

committer = web3.personal.listAccounts[1]

llm = deploy_contract(abi=contract_abi, bytecode=contract_bytecode)

# Calling contract method
print('Contract version number: {}'.format(llm.call().version()))
llm.transact({'from': committer, 'value': web3.toWei(5000, 'gwei')}).create_commitment("new commitment")
title = llm.call().get_commitment_title(committer)
print(title)
