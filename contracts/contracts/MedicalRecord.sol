// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract MedicalRecord {
    uint256 public recordId;
    enum AccessStatus {Pending, Approved, Denied}
    
    struct Patient {
        uint256 recordId;
        address owner;
        uint256 timestamp;
        string name;
        uint age;
        string gender;
        string bloodType;
        string dataHash;
        
    }
    
    struct Requester {
        address requesterAddress;
        string name;
        string role; // e.g., Doctor, Researcher, etc.
        uint256 registrationTime;
    }

    struct AccessRequest {
        address requester;
        uint256 patientId;
        AccessStatus status;
        string reason;
        uint256 timestamp;
        uint256 expirationTime;
    }

    event AccessRequested(uint256 patientId, address requester, string reason);
    event AccessApproved(uint256 patientId, address requester, uint256 expirationTime);
    event AccessDenied(uint256 patientId, address requester);
    event MedicalRecords__AddRecord(
        uint256 recordId, 
        address indexed owner,
        uint256 timestamp,
        string  name,
        uint256 age,
        string  gender,
        string bloodType,
        string dataHash
    );
    event RequesterAdded(address indexed requesterAddress, string name, string role);

    mapping(uint256 => Patient) public patients; 
    mapping(address => Patient) public patientsByAddress;
    address[] private patientAddresses;
    mapping(address => Requester) public requesters;
    address[] public requesterAddresses;

    mapping(uint256 => mapping(address => AccessRequest)) public accessRequests;
    mapping(uint256 => mapping(address => bool)) public approvedAccess;

    modifier onlyPatient(uint256 patientId) {
        require(patients[patientId].owner == msg.sender, "Only the patient can perform this action");
        _;
    }

    function addPatient(
        address owner,
        string memory name,
        uint age,
        string memory gender,
        string memory bloodType,
        string memory dataHash
    ) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(age > 0 && age < 150, "Invalid age");
        
        recordId++;
        
        Patient memory newPatient = Patient(
            recordId,
            owner,
            block.timestamp,
            name,
            age,
            gender,
            bloodType,
            dataHash
        );
        
        patients[recordId] = newPatient;
        patientsByAddress[owner] = newPatient;
        
        patientAddresses.push(owner);
        
        emit MedicalRecords__AddRecord(
            recordId,
            owner,
            block.timestamp,
            name,
            age,
            gender,
            bloodType,
            dataHash
        );
    }

    function addRequester(string memory name, string memory role) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(role).length > 0, "Role cannot be empty");
    
        Requester memory newRequester = Requester(
            msg.sender,
            name,
            role,
            block.timestamp
        );
    
        requesters[msg.sender] = newRequester;
        requesterAddresses.push(msg.sender);
    
        emit RequesterAdded(msg.sender, name, role);
    }

    function approveAccess(uint256 patientId, address requester, uint256 durationInDays) public onlyPatient(patientId) {
        AccessRequest storage request = accessRequests[patientId][requester];
        require(request.status == AccessStatus.Pending, "Request already processed");
        require(requesters[requester].requesterAddress != address(0), "Requester does not exist");

        request.status = AccessStatus.Approved;
        request.expirationTime = block.timestamp + (durationInDays * 1 days);
        
        approvedAccess[patientId][requester] = true;

        emit AccessApproved(patientId, requester, request.expirationTime);
    }

    function denyAccess(uint256 patientId, address requester) public onlyPatient(patientId) {
        AccessRequest storage request = accessRequests[patientId][requester];
        require(request.status == AccessStatus.Pending, "Request already processed");
        require(requesters[requester].requesterAddress != address(0), "Requester does not exist");

        request.status = AccessStatus.Denied;
        approvedAccess[patientId][requester] = false;

        emit AccessDenied(patientId, requester);
    }

    function requestAccess(uint256 patientId, string memory _reason) public {
        require(patients[patientId].owner != address(0), "Patient does not exist");
        require(requesters[msg.sender].requesterAddress != address(0), "Requester profile not found");
    
        accessRequests[patientId][msg.sender] = AccessRequest(
            msg.sender, 
            patientId, 
            AccessStatus.Pending, 
            _reason, 
            block.timestamp, 
            0
        );
    
        emit AccessRequested(patientId, msg.sender, _reason);
    }

    function hasAccess(uint256 patientId, address requester) public view returns (bool) {
        if (approvedAccess[patientId][requester]) {
            AccessRequest memory request = accessRequests[patientId][requester];
            if (request.expirationTime > block.timestamp) {
                return true;
            }
        }
        return false;
    }

    // Updated function allowing patients to view their own data
    function getPatientData(uint256 patientId) public view returns(
        uint256,
        address,
        uint256,
        string memory,
        uint,
        string memory,
        string memory,
        string memory
    ) {
        // Allow patients to view their own data without checking access
        if (patients[patientId].owner == msg.sender) {
            Patient storage patientData = patients[patientId];
            return (
                patientData.recordId,
                patientData.owner,
                patientData.timestamp,
                patientData.name,
                patientData.age,
                patientData.gender,
                patientData.bloodType,
                patientData.dataHash
            );
        } else {
            // Other users need approved access
            require(hasAccess(patientId, msg.sender), "Access not granted");
            Patient storage patientData = patients[patientId];
            return (
                patientData.recordId,
                patientData.owner,
                patientData.timestamp,
                patientData.name,
                patientData.age,
                patientData.gender,
                patientData.bloodType,
                patientData.dataHash
            );
        }
    }

    function getRequesterData(address requester) public view returns (
        address,
        string memory,
        string memory
    ) {
        require(requesters[requester].requesterAddress != address(0), "Requester does not exist");
        
        Requester memory requesterData = requesters[requester];
        
        return (
            requesterData.requesterAddress,
            requesterData.name,
            requesterData.role
        );
    }

    function getAllPatients() public view returns (Patient[] memory) {
        Patient[] memory allPatients = new Patient[](patientAddresses.length);
        
        for(uint i = 0; i < patientAddresses.length; i++) {
            address patientAddress = patientAddresses[i];
            allPatients[i] = patientsByAddress[patientAddress];
        }
        
        return allPatients;
    }

    function getPatientByAddress(address patientAddress) public view returns (
        uint256,
        address,
        uint256,
        string memory,
        uint,
        string memory,
        string memory,
        string memory
    ) {
        Patient memory patient = patientsByAddress[patientAddress];
        
        return (
            patient.recordId,
            patient.owner,
            patient.timestamp,
            patient.name,
            patient.age,
            patient.gender,
            patient.bloodType,
            patient.dataHash
        );
    }

    function getPatientCount() public view returns (uint256) {
        return patientAddresses.length;
    }

    function getRecordId() public view returns (uint) {
        return recordId;
    }

    function getTimeStamp(uint _recordId) public view returns (uint) {
        return patients[_recordId].timestamp;
    }

    function getName(uint _recordId) public view returns (string memory) {
        return patients[_recordId].name;
    }

    function getAge(uint _recordId) public view returns (uint) {
        return patients[_recordId].age;
    }

    function getGender(uint _recordId) public view returns (string memory) {
        return patients[_recordId].gender;
    }

    function getBloodType(uint _recordId) public view returns (string memory) {
        return patients[_recordId].bloodType;
    }

    function getRequesterAddress(address requester) public view returns (address) {
        require(requesters[requester].requesterAddress != address(0), "Requester does not exist");
        return requesters[requester].requesterAddress;
    }

    function getRequesterName(address requester) public view returns (string memory) {
        require(requesters[requester].requesterAddress != address(0), "Requester does not exist");
        return requesters[requester].name;
    }

    function getRequesterRole(address requester) public view returns (string memory) {
        require(requesters[requester].requesterAddress != address(0), "Requester does not exist");
        return requesters[requester].role;
    }
}
