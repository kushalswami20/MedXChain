import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader } from 'lucide-react';
import { getContractConfig } from '../utils/contract';

const RequesterList = () => {
  const [requesters, setRequesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequesters();
  }, []);

  const fetchRequesters = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );

      // Get the length of requesterAddresses array
      let index = 0;
      const requesterData = [];
      
      // Keep trying to get addresses until we hit an error
      while (true) {
        try {
          const address = await contract.requesterAddresses(index);
          
          // Get requester data for this address
          const [requesterAddress, name, role] = await contract.getRequesterData(address);
          const requesterInfo = await contract.requesters(address);

          if (name) {
            requesterData.push({
              address: requesterAddress,
              name,
              role,
              registrationTime: requesterInfo.registrationTime.toNumber()
            });
          }
          
          index++;
        } catch (err) {
          // Break the loop when we've reached the end of the array
          // (This will happen when index exceeds array length)
          break;
        }
      }

      setRequesters(requesterData);
    } catch (err) {
      setError(err.message || 'Error fetching requesters');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const shortenAddress = (address) => {
    if (!address || address === 'N/A') return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="min-h-[calc(100vh-2rem)] flex flex-col">
        <CardHeader className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Medical Requesters</h2>
            <div className="text-sm text-gray-500">
              Total Requesters: {requesters.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {requesters.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No requesters found
            </div>
          ) : (
            <div className="overflow-auto h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Address</TableHead>
                    <TableHead className="whitespace-nowrap">Name</TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead className="whitespace-nowrap">Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requesters.map((requester) => (
                    <TableRow key={requester.address} className="hover:bg-gray-50">
                      <TableCell title={requester.address}>
                        {shortenAddress(requester.address)}
                      </TableCell>
                      <TableCell>{requester.name || 'N/A'}</TableCell>
                      <TableCell>{requester.role || 'N/A'}</TableCell>
                      <TableCell>
                        {requester.registrationTime
                          ? new Date(requester.registrationTime * 1000).toLocaleString()
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequesterList;