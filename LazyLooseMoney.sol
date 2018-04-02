pragma solidity ^ 0.4.21;

contract LlmFactory {

    // contract address storge
    address[] public commitments; // store all commitment contract addresses
    mapping(address => address) public currentCommitment; // current commitment contract address of msg.sender

    /* events to log */
    event CommitmentCreated(address indexed owner, address commitment, string title, uint daysCount, uint createdAt);

    function createCommitment(string _title, uint _days)
    public
    payable
    {
        bool noActiveCommitment = false;
        if (currentCommitment[msg.sender] == 0x0) {
            noActiveCommitment = true;
        } else {
            if  (Commitment(currentCommitment[msg.sender]).getState() == Commitment.State.Closed) {
                noActiveCommitment = true;
            }
        }
        /* require(noActiveCommitment); */
        address newCommitment;
        newCommitment = (new Commitment).value(msg.value)(msg.sender, _title, _days);
        commitments.push(newCommitment);
        currentCommitment[msg.sender] = newCommitment;
        emit CommitmentCreated(msg.sender, newCommitment, _title, _days, now);
    }

    function getCurrentCommitmentAddress()
    public
    view
    returns (address)
    {
        return currentCommitment[msg.sender];
    }

    function getLastCommitmentAddress()
    public
    view
    returns (address)
    {
        return commitments[commitments.length - 1];
    }
}

contract Commitment {
    address BURN_ADDRESS = 0x0;
    /* data structure */
    string public title;
    address public owner;
    address public guardian;

    mapping(address => uint) public supportersFunded;
    uint deposit;
    uint guardianDeposit;
    uint burned;

    uint daysCount;
    uint reportedDays;
    uint completedDays;
    uint pendingDays;

    uint createdAt;
    uint startedAt;
    uint guardedAt;
    uint finishedAt;

    enum State {
        Opened,
        Guarded,
        Started,
        Pending,
        Closed
    }
    State state;

    struct DailyReport {
        bool completed; // guardian report if the commitment for today is completed or not
        bool complained; // owner can complain about daily_report correctness
        bool pending; // guardian can report a pending day if committer got sick ...
        // https://ethereum.stackexchange.com/questions/13021/how-can-you-figure-out-if-a-certain-key-exists-in-a-mapping-struct-defined-insi
        bool reported;
    }
    mapping(uint => DailyReport) dailyReports;

    /* modifiers */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyGuardian() {
        require(msg.sender == guardian);
        _;
    }

    /* constructor */
    function Commitment(address _creator, string _title, uint _days)
    public
    payable
    {
        require(_days > 0);
        /* require(msg.value >= _days * 1 finney); */
        owner = _creator;
        deposit = msg.value;
        burned = 0;

        title = _title;
        daysCount = _days;
        reportedDays = 0;
        completedDays = 0;
        pendingDays = 0;
        state = State.Opened;

        createdAt = now;
        guardianDeposit = 2*(deposit / daysCount);

        emit Created(this, owner, deposit, title, daysCount, createdAt);
    }

    /* events to log */
    event Created(address indexed commitment, address indexed owner, uint deposit, string title, uint daysCount, uint createdAt);
    event fundAdded(address indexed commitment, address indexed supporter, uint value, string encouragement, uint fundedAt);
    event Started(address indexed commitment, address indexed owner, uint startedAt, uint finishedAt);
    event Guarded(address indexed commitment, address indexed owner, address indexed guardian, uint guardianDeposit, uint guardedAt);
    event Reported(address indexed commitment, address indexed owner, address indexed guardian, bool completed, uint reportedAt);
    event Closed(address indexed commitment, address indexed owner, uint dayscount, uint reportedDays, uint completedDays, uint ownerReward, uint guardianReward, uint closedAt);

    /* public functions */
    function getState()
    public
    view
    returns (State)
    {
        return state;
    }

    function getInfo()
    public
    view
    returns (address, string, uint, uint, uint, State, uint, uint)
    {
        return (owner, title, deposit, guardianDeposit, daysCount, state, startedAt, finishedAt);
    }

    function supportFund(string encouragement)
    public
    payable
    {
        supportersFunded[msg.sender] += msg.value;
        emit fundAdded(this, msg.sender, msg.value, encouragement);
    }
    /* owner functions */

    function commit()
    public
    onlyOwner()
    {
        require(state == State.Guarded);
        startedAt = now;
        finishedAt = startedAt + daysCount * 1 days;
        state = State.Started;
        emit Started(this, owner, startedAt, finishedAt);
    }

    function cancel()
    public
    onlyOwner()
    {
        require(state != State.Closed);
        uint x;
        uint y;
        if (guardian == 0x0) {
            /* You loose half money */
            x = this.balance / 2;
            y = this.balance - x;
            BURN_ADDRESS.transfer(y);
            owner.transfer(x);
            burned = burned + y;
        } else {
            /* You loose 2/3 money */
            x = this.balance / 3;
            y = this.balance - 2*x;
            BURN_ADDRESS.transfer(y);
            guardian.transfer(x);
            owner.transfer(x);
            burned = burned + y;
        }
        state = State.Closed;
        emit Closed(this, owner, daysCount, reportedDays, completedDays, x, y, now);
    }

    /* guardian functions */
    function release()
    public
    {
        require(msg.sender == guardian || msg.sender == owner);
        if (state < State.Started) {
            /* If you too lazy to start, guardian get all money after 7 days */
            require(now > guardedAt + 7 days);
            reportedDays = 1;
        } else {
            require(state != State.Closed);
            require(now > finishedAt);
            if (reportedDays == 0) {
                /* If guardian did not report at all, yoy get back your money */
                completedDays = 1;
            }
        }
        uint x = this.balance / (completedDays + reportedDays);
        uint y = x * reportedDays;
        x = this.balance - y;
        guardian.transfer(y);
        owner.transfer(x);
        state = State.Closed;
        emit Closed(this, owner, daysCount, reportedDays, completedDays, x, y, now);
    }

    function beGuardian()
    public
    payable
    {
        require(guardian == 0x0);
        require(msg.sender != owner);
        require(msg.value >= guardianDeposit);
        guardian = msg.sender;
        guardianDeposit = msg.value;
        state = State.Guarded;
        guardedAt = now;
        emit Guarded(this, owner, guardian, guardianDeposit, guardedAt);
    }

    function report(bool completed)
    public
    onlyGuardian()
    {
        require(state == State.Started);
        require(now < finishedAt + 23 hours);
        uint _days = (now - startedAt) / 1 days;
        require(_days < daysCount);
        require(!dailyReports[_days].reported);
        reportedDays = reportedDays + 1;
        if (completed) {
            completedDays = completedDays + 1;
        }
        dailyReports[_days].reported = true;
        dailyReports[_days].completed = completed;
        emit Reported(this, owner, guardian, completed, now);
    }
    /* helpers */

} // end Commitment construct

/*
// https://blog.aragon.one/advanced-solidity-code-deployment-techniques-dc032665f434

Can use web3 to get abi and bytecode
https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetcode
*/
