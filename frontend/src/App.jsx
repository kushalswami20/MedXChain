// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import MetaMaskConnector from './components/MetaMaskConnector';
import AddRequester from './components/RequesterForm';
import RequesterListDisplay from "./components/RequesterList"
import RoleSelection from './components/RoleSelection';
import { RequestAccess, ApproveAccess, DenyAccess, CheckAccess } from "./components/AccessRequestForm"
// import "/Users/kushalarogyaswami/Documents/Error404Hack/frontend/src/App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/rolesection" element= {<RoleSelection />} />
            <Route path="/" element={<MetaMaskConnector />} />
            <Route path="/add-patient" element={<PatientForm />} />
            <Route path="/add-requester" element={<AddRequester />} />
            <Route path="/patient-list" element={<PatientList />} />
            <Route  path="/requester-list" element={<RequesterListDisplay />} />
            <Route path="/requestaccess" element={<RequestAccess />} />
            <Route path="/approveaccess" element={<ApproveAccess />} />
            <Route path="/denyaccess" element={<DenyAccess />} />
            <Route path="/checkaccess" element={<CheckAccess />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;