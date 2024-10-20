import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import MedXchainLogo from "../assets/MedXchain.png"
import BackgroundImage from '../assets/download22.jpeg'; // Import your background image

const MetaMaskConnector = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    checkIfWalletIsConnected();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setError('Please connect to MetaMask.');
    } else {
      setAccount(accounts[0]);
      setError('');
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId, 16));
    window.location.reload();
  };

  const handleDisconnect = () => {
    setAccount('');
    setError('Wallet disconnected');
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chain = await window.ethereum.request({ method: 'eth_chainId' });
      
      setChainId(parseInt(chain, 16));

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      setError('Error checking wallet connection');
      console.error('Error checking wallet connection:', err);
    }
  };

  const movetoRolesection = (role) => {
    if(role === 'go') {
      navigate("/rolesection")
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);
      setError('');
      
    } catch (err) {
      if (err.code === 4001) {
        setError('Please connect to MetaMask.');
      } else {
        setError('Error connecting to wallet');
        console.error('Error connecting to wallet:', err);
      }
    }
  };

  return (
    // <div 
    //   className="min-h-screen bg-cover bg-center" // Remove min-h-screen here
    //   style={{
    //     width: '90vw', // Full width of the viewport
    //     height: '100vh', // Full height of the viewport
    //     backgroundImage: `url(${BackgroundImage})`,
    //     backgroundSize: 'cover',
    //     backgroundPosition: '25% 100%',
    //     backgroundRepeat: 'no-repeat'
    //   }}
    // >
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="text-xl font-bold text-gray-100">
            <div className="flex items-center justify-center mb-4">
              <img 
                src={MedXchainLogo}
                alt="MetaMask Logo" 
                className="w-12 h-12 rounded-full m-2"
              />
            </div>
            Wallet Connection
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-900 bg-red-950">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {account ? (
                <div className="space-y-2">
                  <Alert className="border-green-900 bg-green-950">
                    <Check className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      Connected to: {account.slice(0, 6)}...{account.slice(-4)}
                    </AlertDescription>
                  </Alert>
                  <div className="text-sm text-gray-400">
                    Network ID: {chainId}
                  </div>
                  <Button
                    onClick={() => movetoRolesection('go')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Go
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={connectWallet}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    // </div>
  );
};

export default MetaMaskConnector;
