pragma solidity ^0.4.24;

contract Channels {

    /*--- Structures ---*/
    enum ChannelStatus {NONE, OPENED, CLOSED, CANCELED}
    struct Channel {
        ChannelStatus status;
        address sender;
        address recipient;
        uint256 value;
        uint256 openedAt;
        uint256 fee;
        uint256 timeout;
    }

    /*--- Events ---*/
    event ChannelOpened(bytes32 id, address sender, address recipient, uint256 value);
    event ChannelClosed(bytes32 id, uint256 toSender, uint256 toRecipient);
    //event СhannelCanceled(bytes32 id);

    /*--- Store ---*/
    address public owner;
    uint256 public fee;
    uint256 public timeout;
    uint256 public totalFee;

    mapping(bytes32 => Channel) channels;
    mapping(bytes32 => address) signatures;

    /*--- Modifiers ---*/
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function setFee(uint256 _fee)
    external onlyOwner {
        require(_fee < 100);
        fee = _fee;
    }

    function setTimeout(uint256 _timeout)
    external onlyOwner {
        timeout = _timeout;
    }

    function withdrawTotalFee(address to)
    external onlyOwner {
        to.transfer(totalFee);
    }

    function open(bytes32 id, address recipient)
    external payable {
        require(channels[id].status == ChannelStatus.NONE, "Channel with the same id already exists.");
        Channel memory channel = Channel({
            status : ChannelStatus.OPENED,
            sender : msg.sender,
            recipient : recipient,
            value : msg.value,
            fee : fee,
            timeout : timeout,
            openedAt : block.timestamp
            });
        channels[id] = channel;
        emit ChannelOpened(id, msg.sender, recipient, msg.value);
    }

    function close(bytes32 h, uint8 v, bytes32 r, bytes32 s, bytes32 id, uint value)
    external {
        Channel storage channel = channels[id];
        require(channel.status == ChannelStatus.OPENED);

        uint256 channelValue = channel.value;
        require(value <= channelValue);

        address signer = ecrecover(h, v, r, s);
        require(signer == channel.sender || signer == channel.recipient);

        bytes32 proof = keccak256(abi.encodePacked(id, value));
        require(proof == h, "Signature is valid but doesn't match the data provided");

        if (signatures[proof] == 0) {
            signatures[proof] = signer;
        } else if (signatures[proof] != signer) {
            //channel completed, both signatures provided
            uint256 channelFee = channel.fee;
            uint256 toRecipient = value - getFeeAmount(value, channelFee);
            uint256 toSender = (channelValue - value) - getFeeAmount(channelValue - value, channelFee);
            totalFee += channelValue - toRecipient - toSender;
            channel.recipient.transfer(toRecipient);
            channel.sender.transfer(toSender);
            channel.status = ChannelStatus.CLOSED;
            emit ChannelClosed(id, toSender, toRecipient);
        }
    }

    function getFeeAmount(uint256 amount, uint256 feePercents)
    private pure returns (uint256) {
        return (amount * feePercents) / 100;
    }
}