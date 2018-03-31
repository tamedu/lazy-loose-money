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
    uint deposited;
    uint burned;

    uint daysCount;
    uint startedAt;
    uint createdAt;
    uint closedAt;

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
        owner = _creator;
        deposited = msg.value;
        burned = 0;

        title = _title;
        daysCount = _days;
        state = State.Opened;

        createdAt = now;

        emit Created(this, title, daysCount);
    }

    /* events to log */
    event Created(address indexed commitment, string title, uint daysCount);
    event fundAdded(address indexed supporter, uint value, string encouragement);

    /* public functions */
    function getInfo()
    public
    view
    returns (address, string, uint)
    {
        return (owner, title, daysCount);
    }

    function supportFund(string encouragement)
    public
    payable
    {
        supportersFunded[msg.sender] += msg.value;
        emit fundAdded(msg.sender, msg.value, encouragement);
    }
    /* owner functions */

    /* guardian functions */

    /* helpers */

} // end Commitment construct

/*
// https://blog.aragon.one/advanced-solidity-code-deployment-techniques-dc032665f434

Can use web3 to get abi and bytecode
https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetcode
*/
