import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        checkWalletConnection();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this dApp!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8">Web3 React dApp</h1>
      {account ? (
        <div className="text-center">
          <p className="mb-2">Connected Account: {account}</p>
          <p className="mb-4">Balance: {balance} ETH</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-full flex items-center hover:bg-blue-100 transition duration-300"
        >
          <Wallet className="mr-2" />
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;