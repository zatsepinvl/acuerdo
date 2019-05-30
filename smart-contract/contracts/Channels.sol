pragma solidity ^0.5.0;

import "./Owanble.sol";
import "./EternalStorage.sol";
import "./ChannelsRepository.sol";

contract Channels is Ownable {

    using ChannelsRepository for address;

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
    uint256 public fee;
    uint256 public totalFee;
    address public channels;

    constructor(uint256 _fee, address eternalStorage) public {
        fee = _fee;
        channels = eternalStorage;
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function withdrawTotalFee(address payable to) external onlyOwner {
        to.transfer(totalFee);
        totalFee = 0;
    }

    function open(bytes32 channelId, address payable recipient, uint256 dueDate)
    external payable {
        require(channels.getSender(channelId) == address(0), "Channel with the same channelId already exists.");
        uint256 value = msg.value - fee;
        channels.saveChannel(channelId, msg.sender, recipient, value, dueDate);
        totalFee += fee;
        emit ChannelOpened(channelId, msg.sender, recipient, value, dueDate, fee);
    }

    bytes prefix = "\x19Ethereum Signed Message:\n32";

    function close(bytes32 h, uint8 v, bytes32 r, bytes32 s, bytes32 channelId, uint256 value)
    public {
        address payable channelSender = address(uint160(channels.getSender(channelId)));
        address payable channelRecipient = address(uint160(channels.getRecipient(channelId)));
        
        require(channelSender != address(0));
        require(msg.sender == channelSender || msg.sender == channelRecipient);

        address signer = channelSender == msg.sender ? channelRecipient : channelSender;

        uint256 channelValue = channels.getValue(channelId);
        require(value <= channelValue);

        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, h));
        address actualSigner = ecrecover(prefixedHash, v, r, s);
        require(actualSigner == signer);

        bytes32 proof = getPaymentId(channelId, value);
        require(proof == h, "Signature is valid but doesn't match the data provided");

        channelRecipient.transfer(value);
        uint256 toSender = channelValue - value;
        if (toSender > 0) {
            channelSender.transfer(toSender);
        }
        channels.deleteChannel(channelId);
        emit ChannelClosed(channelId, toSender, value);
    }

    function cancel(bytes32 channelId)
    external {
        address payable channelSender = address(uint160(channels.getSender(channelId)));

        require(channelSender != address(0));
        require(msg.sender == channelSender);
        require(now > channels.getDueDate(channelId));

        channelSender.transfer(channels.getValue(channelId));
        channels.deleteChannel(channelId);
        emit ChannelCanceled(channelId);
    }

    function getPaymentId(bytes32 channelId, uint256 value)
    public pure returns (bytes32) {
        return keccak256(abi.encodePacked(channelId, value));
    }
}