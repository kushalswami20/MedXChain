import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getContractConfig } from '../utils/contract';

const PatientForm = ({ contractAddress, contractABI }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    owner: '',
    name: '',
    age: '',
    gender: '',
    bloodType: '',
    dataHash: '',
  });
  const [file, setFile] = useState(null); // State for handling file uploads

  // Function to calculate data hash
  const calculateDataHash = (data) => {
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ['string', 'uint', 'string', 'string'],
      [data.name, parseInt(data.age), data.gender, data.bloodType]
    );
    return ethers.utils.keccak256(encodedData);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Save the file in state
    }
  };

  // Upload the file to Pinata
  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`https://api.pinata.cloud/pinning/pinFileToIPFS`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
      },
    });

    const data = response.data;
    if (data.IpfsHash) {
      return data.IpfsHash;
    } else {
      throw new Error('Failed to upload image to Pinata');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const dataHash = formData.dataHash || calculateDataHash(formData);

      // Upload the file to Pinata if a file is selected
      let dataHashFromIpfs = '';
      if (file) {
        dataHashFromIpfs = await uploadToPinata(file);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer);

      console.log('Contract Address:', contractConfig.address);
      console.log('Form Data:', formData);
      console.log('Image Hash:', dataHashFromIpfs);

      // Call smart contract to add the patient
      const tx = await contract.addPatient(
        formData.owner,
        formData.name,
        parseInt(formData.age),
        formData.gender,
        formData.bloodType,
        dataHashFromIpfs || dataHash // Use IPFS hash if available
      );

      const receipt = await tx.wait();
      const event = receipt.events?.find((e) => e.event === 'MedicalRecords__AddRecord');
      if (event) {
        console.log('Event triggered');
        setSuccess(`Patient added successfully! Transaction: ${receipt.transactionHash}`);
      }
      alert('Patient added successfully!');
      // Navigating to patient-list page
      navigate('/patient-list');
      setFormData({
        owner: '',
        name: '',
        age: '',
        gender: '',
        bloodType: '',
        dataHash: '',
      });
      setFile(null); // Reset file input

    } catch (err) {
      setError(err.message || 'Error adding patient');
      console.error('Error:', err);
    } finally {
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

  const handleConnect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setFormData((prev) => ({
        ...prev,
        owner: accounts[0],
      }));
    } catch (err) {
      setError('Error connecting to MetaMask');
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col  text-gray-200">
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full px-4">
          <Card className="flex-1 bg-gray-900 border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <User className="h-12 w-12 text-blue-400" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-100">Add Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    name="owner"
                    placeholder="Patient Owner Address"
                    value={formData.owner}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <Button className=" bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" type="button" onClick={handleConnect} variant="outline">
                    Connect
                  </Button>
                </div>

                <div className="space-y-2">
                  <Input
                    name="name"
                    placeholder="Patient Name"
                    value={formData.name}
                    className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    name="age"
                    className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Select
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.gender}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select
                    value={formData.bloodType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodType: value }))}
                  >
                    <SelectTrigger className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <SelectValue className= "text-gray-200" placeholder="Select Blood Type" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <input
                    // className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full"
                  disabled={loading}
                >
                  {loading ? <Loader className="animate-spin" /> : 'Add Patient'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
