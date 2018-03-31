from deploy_contracts import *
'''
contract_file = open('vyper-contracts/lazy_loose_money.v.py', 'r')
contract_code = contract_file.read()
contract_file.close()

from vyper import compiler
vyper_compiler = compiler.Compiler()
contract_bytecode = vyper_compiler.compile(contract_code).hex()
contract_abi = vyper_compiler.mk_full_signature(contract_code)
llm = deploy_contract(abi=contract_abi, bytecode=contract_bytecode)

# Calling contract method
print('Contract version number: {}'.format(llm.call().version()))

committer = web3.personal.listAccounts[1]
llm.transact({'from': committer, 'value': web3.toWei(5000, 'gwei')}).create_commitment("new commitment")
title = llm.call().get_commitment_title(committer)
print(title)
'''
# https://github.com/ethereum/py-solc
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
txn = llm_factory.transact({'from': committer, 'value': web3.toWei(50000, 'gwei')}).createCommitment("my commitment for next 30 days", 30)
commitment_address = llm_factory.call().getLastCommitmentAddress();
print('Get commitment contract at', commitment_address)
commitment_contract = web3.eth.contract(abi = compiled_commitment['abi'], address = commitment_address)
print(commitment_contract.call().getInfo());
