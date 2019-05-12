pragma solidity ^0.5.0;

contract Channels {

    /*--- Structures ---*/
    struct Channel {
        address payable sender;
        address payable recipient;
        uint256 value;
        uint256 dueDate;
    }

    /*--- Events ---*/
    event ChannelOpened(bytes32 indexed channelId, address indexed sender, address indexed recipient, uint256 value, uint256 dueDate, uint256 feePayed);
    event ChannelClosed(bytes32 indexed channelId, uint256 refundToSender, uint256 releasedToRecipient);
    event ChannelCanceled(bytes32 channelId);


    /*--- Store ---*/
    address public owner;
    uint256 public fee;
    uint256 public totalFee;

    mapping(bytes32 => Channel) public channels;

    /*--- Modifiers ---*/
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(uint256 _fee) public {
        owner = msg.sender;
        fee = _fee;
    }

    function setFee(uint256 _fee)
    external onlyOwner {
        fee = _fee;
    }

    function withdrawTotalFee(address payable to)
    external onlyOwner {
        to.transfer(totalFee);
        totalFee = 0;
    }

    function open(bytes32 channelId, address payable recipient, uint256 dueDate)
    external payable {
        require(channels[channelId].sender == address(0), "Channel with the same channelId already exists.");
        Channel memory channel = Channel({
            sender : msg.sender,
            recipient : recipient,
            value : msg.value - fee,
            dueDate : dueDate
        });
        channels[channelId] = channel;
        totalFee += fee;
        emit ChannelOpened(channelId, channel.sender, channel.recipient, channel.value, channel.dueDate, fee);
    }

    bytes prefix = "\x19Ethereum Signed Message:\n32";

    function close(bytes32 h, uint8 v, bytes32 r, bytes32 s, bytes32 channelId, uint256 value)
    public {
        Channel storage channel = channels[channelId];
        require(channel.sender != address(0));
        require(msg.sender == channel.sender || msg.sender == channel.recipient);
        address signer = channel.sender == msg.sender ? channel.recipient : channel.sender;

        uint256 channelValue = channel.value;
        require(value <= channelValue);

        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, h));
        address actualSigner = ecrecover(prefixedHash, v, r, s);
        require(actualSigner == signer);

        bytes32 proof = getPaymentId(channelId, value);
        require(proof == h, "Signature is valid but doesn't match the data provided");

        uint256 toSender = channelValue - value;
        channel.recipient.transfer(value);
        if (toSender > 0) {
            channel.sender.transfer(toSender);
        }
        delete channels[channelId];
        emit ChannelClosed(channelId, toSender, value);
    }

    function cancel(bytes32 channelId)
    external {
        Channel storage channel = channels[channelId];
        require(channel.sender != address(0));
        require(msg.sender == channel.sender);
        require(now > channel.dueDate);
        channel.sender.transfer(channel.value);
        delete channels[channelId];
        emit ChannelCanceled(channelId);
    }

    function getPaymentId(bytes32 channelId, uint256 value)
    public pure returns (bytes32) {
        return keccak256(abi.encodePacked(channelId, value));
    }
}