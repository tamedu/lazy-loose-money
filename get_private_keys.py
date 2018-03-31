import os
from eth_account import Account
import binascii

for filename in os.listdir('chain_data/keystore'):
    with open('./chain_data/keystore/' + filename) as keyfile:
        keyfile_json = keyfile.read()
    private_key = Account.decrypt(keyfile_json, 'demo')
    print('Address:', Account.privateKeyToAccount(private_key).address,
    ' Private key:', binascii.hexlify(private_key).decode('ascii'))    
