// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    constructor(string[] memory _candidateNames, uint256 _durationMinutes) {
        for (uint256 i=0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationMinutes * 1 minutes);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({
            name: _name,
            voteCount: 0
        }));
    }

    function vote(uint256 candidateIndex) public {
        require(block.timestamp >= votingStart && block.timestamp <= votingEnd, "Voting period is not active");
        require(!voters[msg.sender], "You have already voted");
        voters[msg.sender] = true;
        candidates[candidateIndex].voteCount += 1;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}