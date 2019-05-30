pragma solidity ^0.5.0;

import "./Owanble.sol";

contract EternalStorage is Ownable {

    mapping(bytes32 => uint256)    private uInt256Storage;
    mapping(bytes32 => string)     private stringStorage;
    mapping(bytes32 => address)    private addressStorage;
    mapping(bytes32 => bytes)      private bytesStorage;
    mapping(bytes32 => bytes32)    private bytes32Storage;
    mapping(bytes32 => bool)       private boolStorage;
    mapping(bytes32 => int256)     private int256Storage;


    /// @dev Only allow access from the latest version of a contract in the Rocket Pool network after deployment
    modifier onlyAllowed() {
        require(boolStorage[contractKey(msg.sender)] || msg.sender == owner);
        _;
    }

    function allowContract(address contractAddress) external onlyOwner {
        boolStorage[contractKey(contractAddress)] = true;
    }

    function prohibitContract(address contractAddress) external onlyOwner {
        delete boolStorage[contractKey(contractAddress)];
    }
    
    function contractKey(address contractAddress) pure private returns (bytes32) {
        return keccak256(abi.encodePacked("contract.allowed", contractAddress));
    }

    /**** Get Methods ***********/

    function getAddress(bytes32 _key) external view returns (address) {
        return addressStorage[_key];
    }

    function getString(bytes32 _key) external view returns (string memory) {
        return stringStorage[_key];
    }

    function getBytes(bytes32 _key) external view returns (bytes memory) {
        return bytesStorage[_key];
    }

    function getBool(bytes32 _key) external view returns (bool) {
        return boolStorage[_key];
    }

     function getBytes32(bytes32 _key) external view returns (bytes32) {
        return bytes32Storage[_key];
    }

    function getUint256(bytes32 _key) external view returns (uint) {
        return uInt256Storage[_key];
    }

    function getInt256(bytes32 _key) external view returns (int) {
        return int256Storage[_key];
    }


    /**** Set Methods ***********/
    function setAddress(bytes32 _key, address _value) onlyAllowed external {
        addressStorage[_key] = _value;
    }

    function setString(bytes32 _key, string calldata _value) onlyAllowed external {
        stringStorage[_key] = _value;
    }

    function setBytes(bytes32 _key, bytes calldata _value) onlyAllowed external {
        bytesStorage[_key] = _value;
    }
    
    function setBool(bytes32 _key, bool _value) onlyAllowed external {
        boolStorage[_key] = _value;
    }
    
    function setBytes32(bytes32 _key, bytes32 _value) onlyAllowed external {
        bytes32Storage[_key] = _value;
    }

    function setUint256(bytes32 _key, uint256 _value) onlyAllowed external {
        uInt256Storage[_key] = _value;
    }

    function setInt256(bytes32 _key, int256 _value) onlyAllowed external {
        int256Storage[_key] = _value;
    }


    /**** Delete Methods ***********/

    function deleteAddress(bytes32 _key) onlyAllowed external {
        delete addressStorage[_key];
    }

    function deleteString(bytes32 _key) onlyAllowed external {
        delete stringStorage[_key];
    }

    function deleteBytes(bytes32 _key) onlyAllowed external {
        delete bytesStorage[_key];
    }
    
    function deleteBool(bytes32 _key) onlyAllowed external {
        delete boolStorage[_key];
    }
    
    function deleteBytes32(bytes32 _key) onlyAllowed external {
        delete bytes32Storage[_key];
    }
    
    function deleteUint256(bytes32 _key) onlyAllowed external {
        delete uInt256Storage[_key];
    }

    function deleteInt256(bytes32 _key) onlyAllowed external {
        delete int256Storage[_key];
    }

}