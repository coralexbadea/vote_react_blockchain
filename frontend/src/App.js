// filepath: /C:/Users/user/Desktop/ProramFiles/CRYPTO_/Voting_react/src/App.js
import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import Voting from './components/Voting';


const App = () => {
  const [signer, setSigner] = useState(null);

  return (
    <div>
      <h1>Voting DApp</h1>
      <ConnectWallet setSigner={setSigner} />
      {signer && <Voting signer={signer} />}
    </div>
  );
};

export default App;