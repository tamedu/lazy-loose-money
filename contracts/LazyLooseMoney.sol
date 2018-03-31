pragma solidity ^ 0.4.21;

contract LlmFactory {

    // contract address storge
    address[] public commitments; // store all commitment contract addresses
    mapping(address => address) public currentCommitment; // current commitment contract address of msg.sender

    /* events to log */
    event CommitmentCreated(address indexed owner, address commitment, string title, uint daysCount);

    function createCommitment(string _title, uint _days)
    public
    payable
    {
        require(currentCommitment[msg.sender] == 0x0);
        address newCommitment;
        newCommitment = (new Commitment).value(msg.value)(msg.sender, _title, _days);
        commitments.push(newCommitment);
        currentCommitment[msg.sender] = newCommitment;
        emit CommitmentCreated(msg.sender, newCommitment, _title, _days);
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
    /* data structure */
    string public title;
    address public owner;
    address public guardian;

    mapping(address => uint) public supportersFunded;
    uint deposit;
    uint guardianDeposit;
    uint burned;

    uint daysCount;
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
        bool complained; // owner can complain about daily_report correctness or not
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
        require(_days >= 3);
        /* require(msg.value >= _days * 1 finney); */
        owner = _creator;
        deposit = msg.value;
        burned = 0;

        title = _title;
        daysCount = _days;
        state = State.Opened;

        createdAt = now;
        guardianDeposit = 2*(deposit / daysCount);

        emit Created(this, owner, deposit, title, createdAt, daysCount);
    }

    /* events to log */
    event Created(address indexed commitment, address indexed owner, uint deposit, string title, uint createdAt, uint daysCount);
    event fundAdded(address indexed commitment, address indexed supporter, uint value, string encouragement);
    event Started(address indexed commitment, address indexed owner, uint startedAt, uint finishedAt);
    event Guarded(address indexed commitment, address indexed owner, address indexed guardian, uint guardianDeposit, uint guardedAt);

    /* public functions */
    function getInfo()
    public
    view
    returns (address, string, uint, uint, uint, uint, uint)
    {
        return (owner, title, deposit, guardianDeposit, daysCount, startedAt, finishedAt);
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

    /* guardian functions */

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

    /* helpers */

} // end Commitment construct

/*
// https://blog.aragon.one/advanced-solidity-code-deployment-techniques-dc032665f434

Can use web3 to get abi and bytecode
https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetcode
*/
