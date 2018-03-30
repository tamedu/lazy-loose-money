# Events to log
# Up to 3 parameters can be indexed https://media.consensys.net/technical-introduction-to-events-and-logs-in-ethereum-a074d65dd61e
Created: event({ _owner: indexed(address) })
FundsAdded: event({ _amount: wei_value, _state: int128 })
FundsRecovered: event({ })
Committed: event({ _guardian: indexed(address) })
Closed: event({ _burnablePaymentId: indexed(int128) })

# ***** Data *****

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


# ***** Public *****
