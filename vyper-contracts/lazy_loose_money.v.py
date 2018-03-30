# Events to log
# Up to 3 parameters can be indexed https://media.consensys.net/technical-introduction-to-events-and-logs-in-ethereum-a074d65dd61e
Created: event({ _owner: indexed(address) })
FundsAdded: event({ _amount: wei_value, _state: int128 })
FundsRecovered: event({ })
Committed: event({ _guardian: indexed(address) })
Closed: event({ _burnablePaymentId: indexed(int128) })

# ***** Data *****

commitments: public({
    title: bytes <= 300,
    owner: address,
    guardian: address, # the one who report everyday commitment

    supporters_funds: wei_value[address], # supporters will add funds to encourage commitment owner
    deposit: wei_value, # commitment owner need to deposit money in
    amount_burned: wei_value,
    _balance: wei_value, # = deposit + supporters_funds.sum - amount_burned

    days: int128,
    started_at: timestamp,
    daily_reports: {
        completed: bool, # guardian report if the commitment for today is completed or not
        complained: bool, # owner can complain about daily_report correctness or not
    }[int128],

    state: int128,
}[address])

State: public({
    Opened: int128,
    Committed: int128,
    Closed: int128,
})

# ***** Constructor *****

@public
@payable
def __init__():
    self.State.Opened = 0
    self.State.Committed = 1
    self.State.Closed = 2

# ***** Helpers *****

@public
@constant
def days_passed(committer: address) -> int128:
    # block.timestamp is a uint256 value in seconds since the epoch
    # return floor(decimal(block.timestamp - self.commitments[committer].started_at) / 86400) # 24*60*60 seconds
    return 0

@public
@constant
def guardian_daily_reward(committer: address) -> wei_value:
    # self.commitments[committer]._balance /
    return 0

@public
@constant
def version() -> int128:
    return 1

# ***** Public *****
@public
@payable
def create_commitment() -> bool:
    committer: address = msg.sender
    if (self.commitments[committer].owner != 0x0000000000000000000000000000000000000000
            and self.commitments[msg.sender].state != self.State.Closed):
        return False
    else:
        self.commitments[committer].owner = committer
        return True
