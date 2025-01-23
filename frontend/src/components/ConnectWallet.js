import React, { useState } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = ({ setSigner }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum); // ethers v5
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  return (
    <div>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;