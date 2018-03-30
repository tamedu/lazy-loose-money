from deploy_contracts import *

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

# https://github.com/ethereum/py-solc
from solc import compile_source
compile_source
contract_file = open('contracts/LlmFactory.sol', 'r')
contract_code = contract_file.read()
contract_file.close()
compiled = compile_source(contract_code)['<stdin>:LlmFactory']
llm_factory = deploy_contract(abi=compiled['abi'], bytecode=compiled['bin'])
