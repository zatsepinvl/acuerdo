pragma solidity ^0.5.0;

import "./EternalStorage.sol";

library ChannelsRepository {

    function saveChannel(
        address storageAddress, bytes32 channelId, 
        address sender, address recipient, 
        uint256 value, uint256 dueDate
    ) public {
        EternalStorage st = EternalStorage(storageAddress);
        st.setAddress(keccak256(abi.encodePacked("channel.sender", channelId)), sender);
        st.setAddress(keccak256(abi.encodePacked("channel.recipient", channelId)), recipient);
        st.setUint256(keccak256(abi.encodePacked("channel.value", channelId)), value);
        st.setUint256(keccak256(abi.encodePacked("channel.duedate", channelId)), dueDate);
    }

    function deleteChannel(address storageAddress, bytes32 channelId) public {
        EternalStorage st = EternalStorage(storageAddress);
        st.deleteAddress(keccak256(abi.encodePacked("channel.sender", channelId)));
        st.deleteAddress(keccak256(abi.encodePacked("channel.recipient", channelId)));
        st.deleteUint256(keccak256(abi.encodePacked("channel.value", channelId)));
        st.deleteUint256(keccak256(abi.encodePacked("channel.duedate", channelId)));
    }

    function getSender(address storageAddress, bytes32 channelId) public view returns (address) {
        return EternalStorage(storageAddress).getAddress(keccak256(abi.encodePacked("channel.sender", channelId)));
    }

    function getRecipient(address storageAddress, bytes32 channelId) public view returns (address){
        return EternalStorage(storageAddress).getAddress(keccak256(abi.encodePacked("channel.recipient", channelId)));
    }

    function getValue(address storageAddress, bytes32 channelId) public view returns (uint256){
        return EternalStorage(storageAddress).getUint256(keccak256(abi.encodePacked("channel.value", channelId)));
    }

    function getDueDate(address storageAddress, bytes32 channelId) public view returns (uint256){
        return EternalStorage(storageAddress).getUint256(keccak256(abi.encodePacked("channel.duedate", channelId)));
    }

}