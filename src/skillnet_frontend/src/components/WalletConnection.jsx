import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WalletConnection = ({ onConnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ic?.plug) {
      const connected = await window.ic.plug.isConnected();
      setIsConnected(connected);
      if (connected) {
        await updateBalance();
      }
    }
  };

  const connectWallet = async () => {
    if (window.ic?.plug) {
      try {
        const whitelist = [process.env.CANISTER_ID];
        const host = process.env.CANISTER_HOST;
        await window.ic.plug.requestConnect({ whitelist, host });
        setIsConnected(true);
        await updateBalance();
        onConnect(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      window.open('https://plugwallet.ooo/', '_blank');
    }
  };

  const updateBalance = async () => {
    if (window.ic?.plug) {
      const balance = await window.ic.plug.requestBalance();
      setBalance(balance[0].amount);
    }
  };

  return (
    <div className="mb-4">
      {isConnected ? (
        <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg">
          <span className="text-green-700">Wallet Connected</span>
          <span className="text-green-700 font-bold">{balance} ICP</span>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={connectWallet}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Plug Wallet
        </motion.button>
      )}
    </div>
  );
};

export default WalletConnection;