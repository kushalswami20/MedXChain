import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { getContractConfig } from '../utils/contract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, User, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Ensure correct path

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        if (role === 'patient') {
            navigate('/add-patient');
        } else if (role === 'requester') {
            navigate('/add-requester');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br ">
            {/* <Navbar /> */}
            <div className="flex-1 flex justify-center items-center p-4">
                <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full px-4">
                    {/* Patient Card */}
                    <Card className="flex-1 bg-gray-900 border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-4">
                                <User className="h-12 w-12 text-blue-400" />
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-100">Patient</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-400 mb-6">
                                Register or access your medical records securely on the blockchain.
                                Your data remains encrypted.
                            </p>
                            <div className="space-y-2">
                                <ul className="text-gray-400 text-sm space-y-2 mb-6 text-left">
                                    <li className="flex items-center">
                                        <span className="mr-2">•</span>
                                        Store medical records securely
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2">•</span>
                                        Control access to your data
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2">•</span>
                                        View access history
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleRoleSelection('patient')}
                            >
                                Select Patient Role
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Requester Card */}
                    <Card className="flex-1 bg-gray-900 border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-4">
                                <UserCog className="h-12 w-12 text-blue-400" />
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-100">Requester</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-400 mb-6">
                                Healthcare professionals and researchers can request 
                                secure access to patient records.
                            </p>
                            <div className="space-y-2">
                                <ul className="text-gray-400 text-sm space-y-2 mb-6 text-left">
                                    <li className="flex items-center">
                                        <span className="mr-2">•</span>
                                        Request patient data access
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2">•</span>
                                        Secure data handling
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2">•</span>
                                        Audit trail of access
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleRoleSelection('requester')}
                            >
                                Select Requester Role
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;