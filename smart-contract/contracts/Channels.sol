pragma solidity ^0.4.24;

contract Channels {

    /*--- Structures ---*/
    struct Channel {
        bool exists;
        address sender;
        address recipient;
        uint256 value;
        uint256 fee;
        uint256 canCanceledAt;
    }

    /*--- Events ---*/
    event ChannelOpened(bytes32 channelId, address sender, address recipient, uint256 value, uint256 fee, uint256 canCanceledAt);
    event ChannelClosed(bytes32 channelId, uint256 toSender, uint256 toRecipient);
    event ChannelCanceled(bytes32 channelId);

    /*--- Store ---*/
    address public owner;
    uint256 public fee;
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
        fee = 2;
    }

    function setFee(uint256 _fee)
    external onlyOwner {
        require(_fee < 100);
        fee = _fee;
    }

    function withdrawTotalFee(address to)
    external onlyOwner {
        to.transfer(totalFee);
    }

    function open(bytes32 channelId, address recipient, uint256 timeout)
    external payable {
        require(!channels[channelId].exists, "Channel with the same channelId already exists.");
        Channel memory channel = Channel({
            exists : true,
            sender : msg.sender,
            recipient : recipient,
            value : msg.value,
            fee : fee,
            canCanceledAt : now + timeout
        });
        channels[channelId] = channel;
        emit ChannelOpened(channelId, channel.sender, channel.recipient, channel.value, channel.fee, channel.canCanceledAt);
    }

    function closeByAll(bytes32[2] h, uint8[2] v, bytes32[2] r, bytes32[2] s, bytes32 channelId, uint value)
    external {
        close(h[0], v[0], s[0], r[0], channelId, value);
        close(h[1], v[1], s[1], r[1], channelId, value);
    }

    bytes prefix = "\x19Ethereum Signed Message:\n32";

    function close(bytes32 h, uint8 v, bytes32 r, bytes32 s, bytes32 channelId, uint256 value)
    public {
        Channel storage channel = channels[channelId];
        require(channel.exists);

        uint256 channelValue = channel.value;
        require(value <= channelValue);

        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, h));
        address signer = ecrecover(prefixedHash, v, r, s);
        require(signer == channel.sender || signer == channel.recipient);

        bytes32 proof = keccak256(abi.encodePacked(channelId, value));
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
            delete channels[channelId];
            emit ChannelClosed(channelId, toSender, toRecipient);
        }
    }

    function cancel(bytes32 channelId) 
    external {
        Channel storage channel = channels[channelId];
        require(channel.exists);
        require(msg.sender == channel.sender);
        require(channel.canCanceledAt <= now);
        channel.sender.transfer(channel.value);
        delete channels[channelId];
        emit ChannelCanceled(channelId);
    }

    function getFeeAmount(uint256 amount, uint256 feePercents)
    private pure returns (uint256) {
        return (amount * feePercents) / 100;
    }
   
}