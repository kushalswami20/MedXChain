// src/components/AddRequester.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardContent,CardFooter , CardTitle} from '@/components/ui/card';
import { getContractConfig } from '../utils/contract';// Path to your ABI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AddRequester = ({ contractAddress }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    owner: '',
    name: '',
    role:''
  });


  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {

        if (!window.ethereum) {
            throw new Error('Please install MetaMask!');
          }

      // Requesting access to user's Ethereum account
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      // Create a contract instance
      const medicalRecordContract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );

      console.log("Contract Address:", contractConfig.address);
      console.log("Form Data:", formData);
      // Call the addRequester function
      const tx = await medicalRecordContract.addRequester(
        formData.name, 
        formData.role
    );
    const receipt = await tx.wait();
    const event = receipt.events?.find(e => e.event === 'RequesterAdded');
    if (event) {
      console.log("event working");
      setSuccess(`requester added successfully! Transaction: ${receipt.transactionHash}`);
    }
    alert('requester added successfully!');
    // navigate('/');
    navigate('/requester-list');
      setMessage('Requester added successfully!');
      setFormData({
        
        name: '',
        role: '',
        
      });
      
    } catch (error) {
        setError(err.message || 'Error adding patient');
        console.error('Error:', err);
    }finally {
        setLoading(false);
      }

    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
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
              <CardTitle className="text-xl font-bold text-gray-100">Add Requester</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            
            <Input 
              
              name="name" 
              placeholder="requester Name"
              value={formData.name} 
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="space-y-2">
            
            <Input 
               
              name="role" 
              placeholder="role"
              value={formData.role} 
              onChange={handleChange}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required 
              
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              'Add Requester'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-600">Fill in the details to add a requester.</p>
      </CardFooter>
    </Card>
    </div>
    </div>
    </div>
    
  );
};

export default AddRequester;
