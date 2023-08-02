// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";


contract BUSDHandler {
    address private owner;
    uint256 public totalSupply;

    event Event(
        address sender,
        address recerver,
        uint256 amount,
        uint256 totalSupply
    );

    event Transfer(address indexed from, address indexed to, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }


    constructor() {
        owner = msg.sender;
    }

    // This function allows the contract to receive BUSD tokens
    function receiveBUSD(address _tokenAddress, address _receiver, uint256 _amount) external {
            require(Token(_tokenAddress).transferFrom(msg.sender, _receiver, _amount));

        totalSupply = totalSupply + _amount;
        emit Event(msg.sender, _receiver, _amount, totalSupply);
        
    }

    // This function allows the contract owner to forward BUSD to another Ethereum address
    function forwardBUSD(address _tokenAddress, address _receiver, uint256 _amount) external onlyOwner {
        Token(_tokenAddress).transfer(_receiver, _amount);

        totalSupply = totalSupply - _amount;
        emit Event(msg.sender, _receiver, _amount, totalSupply);
    }
}
