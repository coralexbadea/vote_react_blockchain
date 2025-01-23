import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingABI from '../contracts/VotingABI.json';
import './Voting.css'; // Create this CSS file for styling

const Voting = ({ signer }) => {
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [votingContract, setVotingContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [votingStart, setVotingStart] = useState(0);
  const [votingEnd, setVotingEnd] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const contractAddress = '0xA6C9e8D77eA0c1D673E1B67F5b153dAB0fC41D41';

  useEffect(() => {
    if (signer) {
      if (!ethers.utils.isAddress(contractAddress)) {
        setError('Invalid contract address');
        return;
      }

      const initializeContract = async () => {
        try {
          const contract = new ethers.Contract(contractAddress, VotingABI.abi, signer);
          setVotingContract(contract);
          
          // Load initial data
          await Promise.all([
            loadCandidates(contract),
            checkOwner(contract),
            loadVotingPeriod(contract)
          ]);
          
        } catch (err) {
          setError('Failed to connect to contract');
          console.error(err);
        }
      };

      initializeContract();
    }
  }, [signer]);

  // Load voting period timestamps
  const loadVotingPeriod = async (contract) => {
    try {
      const start = await contract.votingStart();
      const end = await contract.votingEnd();
      setVotingStart(start.toNumber());
      setVotingEnd(end.toNumber());
      startCountdown(end.toNumber());
    } catch (err) {
      setError('Failed to load voting period');
      console.error(err);
    }
  };

  // Calculate time left for voting
  const startCountdown = (endTime) => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const difference = endTime - now;
      
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft('Voting ended');
        return;
      }

      const hours = Math.floor((difference / (60 * 60)) % 24);
      const minutes = Math.floor((difference / 60) % 60);
      const seconds = Math.floor(difference % 60);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s remaining`);
    }, 1000);
  };

  const loadCandidates = async (contract) => {
    setLoading(true);
    try {
      const candidates = await contract.getCandidates();
      const formattedCandidates = candidates.map((candidate, index) => ({
        id: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toString(),
      }));
      setCandidates(formattedCandidates);
    } catch (err) {
      setError('Failed to load candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkOwner = async (contract) => {
    try {
      const owner = await contract.owner();
      const address = await signer.getAddress();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    } catch (err) {
      setError('Failed to verify ownership');
      console.error(err);
    }
  };

  const addCandidate = async () => {
    if (!candidateName.trim()) {
      setError('Candidate name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const tx = await votingContract.addCandidate(candidateName);
      await tx.wait();
      setCandidateName('');
      await loadCandidates(votingContract);
      setError('');
    } catch (err) {
      setError(err.message.includes('Only owner') 
        ? 'Only contract owner can add candidates' 
        : 'Failed to add candidate');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (index) => {
    setLoading(true);
    try {
      const tx = await votingContract.vote(index);
      await tx.wait();
      await loadCandidates(votingContract);
      setError('');
    } catch (err) {
      const errorMessage = err.message.includes('Voting period') ? 'Voting period has ended' :
                          err.message.includes('already voted') ? 'You have already voted' :
                          err.message.includes('Invalid candidate') ? 'Invalid candidate selected' :
                          'Failed to submit vote';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="voting-container">
      <h1 className="title">Decentralized Voting System</h1>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Processing transaction...</div>}

      <div className="voting-period">
        <h3>Voting Period</h3>
        <p>Start: {formatDate(votingStart)}</p>
        <p>End: {formatDate(votingEnd)}</p>
        <p className="time-left">{timeLeft}</p>
      </div>

      {isOwner && (
        <div className="add-candidate-form">
          <h3>Add New Candidate</h3>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => {
              setCandidateName(e.target.value);
              setError('');
            }}
            placeholder="Enter candidate name"
            className="candidate-input"
          />
          <button 
            onClick={addCandidate}
            className="add-button"
            disabled={loading}
          >
            Add Candidate
          </button>
        </div>
      )}

      <div className="candidates-list">
        <h3>Candidates</h3>
        {candidates.length === 0 && !loading && (
          <p className="no-candidates">No candidates available</p>
        )}
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id} className="candidate-item">
              <div className="candidate-info">
                <span className="candidate-name">{candidate.name}</span>
                <span className="vote-count">{candidate.voteCount} votes</span>
              </div>
              <button 
                onClick={() => vote(candidate.id)}
                className="vote-button"
                disabled={loading}
              >
                Vote
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Voting;