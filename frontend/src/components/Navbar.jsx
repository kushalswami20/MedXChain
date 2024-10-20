import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MedXchainLogo from "../assets/MedXchain.png"
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');

  const isHomePage = location.pathname === '/';
  const isRoleSelectionPage = location.pathname === '/rolesection';
  const isPatientDashboard = location.pathname === '/add-patient';
  const isPatientList = location.pathname === '/patient-list';
  const isRequesterList = location.pathname === "/requester-list";
  const isRequesterDashboard = location.pathname === '/add-requester';
  const isRequestAccess = location.pathname === "/requestaccess";
  const isApproveAccess = location.pathname === "/approveaccess";
  const isDenyAccess = location.pathname === "/denyaccess";
  const isCheckAccess = location.pathname === "/checkaccess";

  useEffect(() => {
    checkIfWalletIsConnected();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setError('Please connect to MetaMask.');
      navigate('/');
    } else {
      setAccount(accounts[0]);
      setError('');
    }
  };

  const handleDisconnect = () => {
    setAccount('');
    setError('Wallet disconnected');
    navigate('/');
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      setError('Error checking wallet connection');
      console.error('Error checking wallet connection:', err);
    }
  };

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
    <nav className="bg-gray-900 shadow-lg w-full ">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center ">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-700 transition-all duration-300">
            <div className="flex items-center justify-center  space-x-4">
              <img 
                src={MedXchainLogo}
                alt="MetaMask Logo" 
                className="w-12 h-15 rounded-full m-2"
              />
             MedXChain 
          </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {error && (
              <Alert variant="destructive" className="py-1 px-2 bg-red-950 border-red-900">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {account ? (
              <>
                <span className="text-gray-300 text-sm">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>

                {/* Navigation Links */}
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    Home
                  </Link>

                  {/* Patient Dashboard Links */}
                  {(isPatientDashboard || isPatientList || isApproveAccess || isDenyAccess) && (
                    <>
                      <Link
                        to="/patient-list"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/patient-list'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Patient List
                      </Link>
                      <Link
                        to="/add-patient"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/add-patient'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Add Patient
                      </Link>
                      <Link
                        to="/approveaccess"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/approveaccess'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Access Approve
                      </Link>
                      <Link
                        to="/denyaccess"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/denyaccess'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Deny Access
                      </Link>
                    </>
                  )}

                  {/* Requester Dashboard Links */}
                  {(isRequesterDashboard || isRequesterList || isRequestAccess || isCheckAccess) && (
                    <>
                      <Link
                        to="/add-requester"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/add-requester'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Add Requester
                      </Link>
                      <Link
                        to="/requester-list"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/requester-list'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Requester List
                      </Link>
                      <Link
                        to="/requestaccess"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/requestaccess'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Request Access
                      </Link>
                      <Link
                        to="/checkaccess"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/checkaccess'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Check Access
                      </Link>
                      <Link
                        to="/patient-list"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === '/patient-list'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Patient List
                      </Link>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;