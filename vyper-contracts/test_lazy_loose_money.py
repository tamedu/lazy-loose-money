# https://github.com/ethereum/pyethereum/blob/develop/ethereum/tools/tester.py

import unittest

from ethereum.tools import tester
import ethereum.utils as utils


def assert_tx_failed(_tester, function_to_test, exception=tester.TransactionFailed):
    """ Ensure that transaction fails, reverting state (to prevent gas exhaustion) """
    initial_state = _tester.s.snapshot()
    _tester.assertRaises(exception, function_to_test)
    _tester.s.revert(initial_state)


class TestLazyLooseMoney(unittest.TestCase):
    def setUp(self):
        # Initialize tester, contract and expose relevant objects
        self.t = tester
        self.s = self.t.Chain()
        self.s.head_state.gas_limit = 10**7
        from vyper import compiler
        self.t.languages['vyper'] = compiler.Compiler()
        self.contract_code = open('lazy_loose_money.v.py').read()

    def test_create_lazy_loose_money_contract(self):
        c = self.s.contract(self.contract_code, language='vyper', args=[])


if __name__ == '__main__':
    unittest.main()
