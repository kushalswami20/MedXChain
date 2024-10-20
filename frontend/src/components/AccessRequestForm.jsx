import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, XCircle, User , UserCog} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ethers } from 'ethers';
import { getContractConfig } from '../utils/contract';

// Request Access Component
const RequestAccess = ({ contract, account }) => {
  const [patientId, setPatientId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      // Create a contract instance
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );

      setStatus({ type: 'loading', message: 'Submitting access request...' });
      
      // Direct contract call without methods
      const tx = await contract.requestAccess(patientId, reason);
      await tx.wait(); // Wait for transaction to be mined
      
      setStatus({ 
        type: 'success', 
        message: 'Access request submitted successfully!' 
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col  text-gray-200">
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full px-4">
          <Card className="flex-1 bg-gray-900 border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="text-center pb-2">
      <div className="flex justify-center mb-4">
                                <UserCog className="h-12 w-12 text-blue-400" />
                            </div>
        <CardTitle className="text-xl font-bold text-gray-100" >Request Access</CardTitle>
        <CardDescription>
          Request access to a patient's medical records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <Input
              type="number"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"              />
          </div>
          <div>
            <Input
              placeholder="Reason for access"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"              />
          </div>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
          {status.message && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
              {status.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertTitle>{status.type === 'error' ? 'Error' : 'Status'}</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
    </div>
    </div>
    </div>
  );
};

// Approve Access Component
const ApproveAccess = ({ contract, account }) => {
  const [patientId, setPatientId] = useState('');
  const [requester, setRequester] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleApprove = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

  // Requesting access to user's Ethereum account
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      // Create a contract instance
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );
      setStatus({ type: 'loading', message: 'Processing approval...' });
      
      // Direct contract call
      const tx = await contract.approveAccess(patientId, requester, duration);
      await tx.wait(); // Wait for transaction to be mined
      
      setStatus({ 
        type: 'success', 
        message: 'Access approved successfully!' 
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br ">
            {/* <Navbar /> */}
            <div className="flex-1 flex justify-center items-center p-4">
                <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full px-4">
    <Card className="flex-1 bg-gray-900 border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="text-center pb-2">
      <div className="flex justify-center mb-4">
                                <User className="h-12 w-12 text-blue-400" />
                            </div>
        <CardTitle className="text-xl font-bold text-gray-100" >Approve Access</CardTitle>
        <CardDescription className="text-center">
          Approve access request to medical records
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <form onSubmit={handleApprove} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"            />
          </div>
          <div>
            <Input
              placeholder="Requester Address"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Duration (days)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"            />
          </div>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Approve Access'}
          </Button>
          {status.message && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
              {status.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertTitle>{status.type === 'error' ? 'Error' : 'Status'}</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
    </div>
    </div>
    </div>
  );
};

// Deny Access Component
const DenyAccess = ({ contract, account }) => {
  const [patientId, setPatientId] = useState('');
  const [requester, setRequester] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleDeny = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      // Requesting access to user's Ethereum account
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      // Create a contract instance
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );
      setStatus({ type: 'loading', message: 'Processing denial...' });
      
      // Direct contract call
      const tx = await contract.denyAccess(patientId, requester);
      await tx.wait(); // Wait for transaction to be mined
      
      setStatus({ 
        type: 'success', 
        message: 'Access denied successfully!' 
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col  text-gray-200">
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full px-4">
          <Card className="flex-1 bg-gray-900 border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-gray-100" >Deny Access</CardTitle>
        <CardDescription>
          Deny access request to medical records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDeny} className="space-y-4">
          <div>
            <Input
              type="number"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"            />
          </div>
          <div>
            <Input
              placeholder="Requester Address"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"            />
          </div>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Deny Access'}
          </Button>
          {status.message && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
              {status.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{status.type === 'error' ? 'Error' : 'Status'}</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
    </div>
    </div>
    </div>
  );
};

// Check Access Component
const CheckAccess = ({ contract, account }) => {
  const [patientId, setPatientId] = useState('');
  const [entity, setEntity] = useState('');
  const [accessStatus, setAccessStatus] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const checkAccess = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

  // Requesting access to user's Ethereum account
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      // Create a contract instance
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );
      setStatus({ type: 'loading', message: 'Checking access...' });
      
      // Direct contract call
      const result = await contract.hasAccess(patientId, entity);
      setAccessStatus(result);
      
      setStatus({ 
        type: 'success', 
        message: `Access status: ${result ? 'Granted' : 'Not granted'}` 
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      });
      setAccessStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col  text-gray-200">
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full px-4">
          <Card className="flex-1 bg-gray-900 border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="text-center pb-2">
      <div className="flex justify-center mb-4">
                                <UserCog className="h-12 w-12 text-blue-400" />
                            </div>
        <CardTitle className="text-xl font-bold text-gray-100" >Check Access</CardTitle>
        <CardDescription>
          Check if an entity has access to medical records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={checkAccess} className="space-y-4">
          <div>
            <Input
              type="number"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"            />
          </div>
          <div>
            <Input
              placeholder="Entity Address"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"            />
          </div>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full" disabled={loading}>
            {loading ? 'Checking...' : 'Check Access'}
          </Button>
          {accessStatus !== null && (
            <Alert variant={accessStatus ? 'default' : 'destructive'}>
              {accessStatus ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>Access Status</AlertTitle>
              <AlertDescription>
                {accessStatus ? 'Access is granted' : 'Access is not granted'}
              </AlertDescription>
            </Alert>
          )}
          {status.message && status.type === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
    </div>
    </div>
    </div>
  );
};

export { RequestAccess, ApproveAccess, DenyAccess, CheckAccess };