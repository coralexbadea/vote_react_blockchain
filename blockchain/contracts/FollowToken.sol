// filepath: /C:/Users/user/Desktop/ProramFiles/CRYPTO_/Voting_react/contracts/FollowToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FollowToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("FOLLOW", "FLW") {
        _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
    }
}