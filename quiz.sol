pragma solidity ^0.5.0;
// ----------------------------------------------------------------------------
// 'QT' 'QuizShow Token' token contract
//
// Symbol      : QT
// Name        : QuizShowToken
// Total supply: 1,000,000.000000000000000000
// Decimals    : 18
//
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}
// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
// ----------------------------------------------------------------------------
contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}
// ----------------------------------------------------------------------------
// Contract function to receive approval and execute function in one call
//
// Borrowed from MiniMeToken
// ----------------------------------------------------------------------------
contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes memory data) public;
}
// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;
    address public newOwner;
    
    event OwnershipTransferred(address indexed _from, address indexed _to);
    constructor() public {
        owner = msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}
// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and a
// fixed supply
// ----------------------------------------------------------------------------
contract QuizShowToken is ERC20Interface, Owned {
    using SafeMath for uint;
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint _totalSupply;
    mapping(address => uint)   balances;
    mapping(address => mapping(address => uint)) allowed;
    struct GameList {
        string datetime;
        string prize_kind;
        string hash_db;
        uint prize_amount;
        uint no_winner;
        uint8 state;
    }
    GameList[] gamelists;
    int public LastNo;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    // constructor() public {
    //     symbol = "QT";
    //     name = "QuizShowToken";
    //     decimals = 18;
    //     _totalSupply = 1000000000000000 * 10**uint(decimals);
    //     balances[owner] = _totalSupply;
    //     emit Transfer(address(0), owner, _totalSupply);
    // }
    constructor(string memory _symbol, string memory _name, uint8 _decimals, uint _total) public {
        symbol = _symbol;
        name = _name;
        decimals = _decimals;
        _totalSupply = _total * 10**uint(decimals);
        balances[owner] = _totalSupply;
        emit Transfer(address(0), owner, _totalSupply);
        LastNo=-1;
    }
    // ------------------------------------------------------------------------
    // Total supply
    // ------------------------------------------------------------------------
    function totalSupply() public view returns (uint) {
        return _totalSupply.sub(balances[address(0)]);
    }
    // ------------------------------------------------------------------------
    // Get the token balance for account `tokenOwner`
    // ------------------------------------------------------------------------
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }
    // ------------------------------------------------------------------------
    // Transfer the balance from token owner's account to `to` account
    // - Owner's account must have sufficient balance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    // ------------------------------------------------------------------------
    // Token owner can approve for `spender` to transferFrom(...) `tokens`
    // from the token owner's account
    //
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
    // recommends that there are no checks for the approval double-spend attack
    // as this should be implemented in user interfaces
    // ------------------------------------------------------------------------
    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    // ------------------------------------------------------------------------
    // Transfer `tokens` from the `from` account to the `to` account
    //
    // The calling account must already have sufficient tokens approve(...)-d
    // for spending from the `from` account and
    // - From account must have sufficient balance to transfer
    // - Spender must have sufficient allowance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
    // ------------------------------------------------------------------------
    // Returns the amount of tokens approved by the owner that can be
    // transferred to the spender's account
    // ------------------------------------------------------------------------
    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
    // ------------------------------------------------------------------------
    // Token owner can approve for `spender` to transferFrom(...) `tokens`
    // from the token owner's account. The `spender` contract function
    // `receiveApproval(...)` is then executed
    // ------------------------------------------------------------------------
    function approveAndCall(address spender, uint tokens, bytes memory data) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, address(this), data);
        return true;
    }
    // ------------------------------------------------------------------------
    // Don't accept ETH
    // ------------------------------------------------------------------------
    function () external payable {
        revert();
    }
    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
    // ------------------------------------------------------------------------
    // 퀴즈게임 접수 : 일시 20190312120000, 상품 QC, 상금 1000000000, 상태 0)
    //   state  상태 : 0 - 대기, 1 - 게임시작, 2-게임종료, 3- 정산종료
    // ------------------------------------------------------------------------
    function reserveQuiz(string memory _datetime, string memory _prize_kind, uint _prize_amount) public onlyOwner  {
        GameList memory gamelist = GameList(_datetime, _prize_kind,'', _prize_amount,0,0);
        gamelists.push(gamelist);
    }
    // ------------------------------------------------------------------------
    // 회차별 퀴즈게임 정보보기
    // datetime   게임시작일시 20190312120000
    //  prize_kind 상품종류(토큰이름) QT
    //  hash_db    우승자DB의 hash값
    //  prize_amount 상금
    //  no_winner    우승자수
    //  state            상태
    // ------------------------------------------------------------------------
    function getQuizList(uint _no) public view returns(string memory datetime, string memory prize_kind, string memory hash_db, uint prize_amount,uint no_winner,uint state){
        require(gamelists.length > _no );
        datetime = gamelists[_no].datetime;
        prize_kind = gamelists[_no].prize_kind;
        hash_db = gamelists[_no].hash_db;
        prize_amount = gamelists[_no].prize_amount;
        no_winner = gamelists[_no].no_winner;
        state = gamelists[_no].state;
    }
    // ------------------------------------------------------------------------
    //  회차별 퀴즈게임 정보저장 
    //  회차 1, 일시 20190312120000, 상품 QT, 상금 1000000000, 우승자정보db의 hash값, 우승자수, 상태
    // 일시, 상품, 우승자정보db의 hash값은 string으로 ''와 같이 비워두면, 기존값 유지.
    // 상금, 우승자수, 상태는 uint로 반드시 값을 채워줘야 함
    //  정산이 끝나면 state를 3으로 하고, LastNo를 현재 _no로 업데이트
    // _no 는 0부터 시작     
    // ------------------------------------------------------------------------    
    function editQuizList(uint _no, string memory _datetime, string memory _prize_kind, string memory _hash_db, uint _prize_amount,uint _no_winner,uint8 _state) public onlyOwner {
        require(gamelists.length > _no );
        if ( keccak256(abi.encodePacked((_datetime))) != keccak256(abi.encodePacked((''))) ) 
        { gamelists[_no].datetime = _datetime ; }
        if ( keccak256(abi.encodePacked((_prize_kind))) != keccak256(abi.encodePacked((''))) ) 
        { gamelists[_no].prize_kind =  _prize_kind; }
        if ( keccak256(abi.encodePacked((_hash_db))) != keccak256(abi.encodePacked((''))) ) 
        { gamelists[_no].hash_db =  _hash_db; }
        gamelists[_no].prize_amount =  _prize_amount;
        gamelists[_no].no_winner = _no_winner;
        gamelists[_no].state = _state;
        if (_state==3) { LastNo=  int(_no); }
    }
}
