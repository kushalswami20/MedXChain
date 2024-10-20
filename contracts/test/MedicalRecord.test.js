const { expect, assert  } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecord Contract", function () {
    let MedicalRecord;
    let medicalRecord;
    let owner, patient, requester1, requester2;

    beforeEach(async function () {
        MedicalRecord = await ethers.getContractFactory("MedicalRecord");
        [owner, patient, requester1, requester2] = await ethers.getSigners();
        medicalRecord = await MedicalRecord.deploy();
        await medicalRecord.waitForDeployment();
    });

    describe("Patient Management", function () {
        it("Should add a patient correctly", async function () {
            await medicalRecord.addPatient(
                patient.address,
                "John Doe",
                30,
                "Male",
                "O+",
                "hash123"
            );

            const patientData = await medicalRecord.patients(1);
            expect(patientData.name).to.equal("John Doe");
            expect(patientData.age).to.equal(30);
        });

        it("Should only allow the patient to perform actions", async function () {
            await medicalRecord.addPatient(
                patient.address,
                "John Doe",
                30,
                "Male",
                "O+",
                "hash123"
            );

            await expect(medicalRecord.connect(requester1).approveAccess(1, requester1.address, 30))
                .to.be.revertedWith("Only the patient can perform this action");
        });
    });

    describe("Requester Management", function () {
        it("Should add a requester correctly", async function () {
            await medicalRecord.connect(requester1).addRequester("Dr. Smith", "Doctor");

            const requesterData = await medicalRecord.getRequesterData(requester1.address);
            expect(requesterData[1]).to.equal("Dr. Smith");
            expect(requesterData[2]).to.equal("Doctor");
        });

        it("Should require requester to be registered for access requests", async function () {
            await medicalRecord.addPatient(
                patient.address,
                "John Doe",
                30,
                "Male",
                "O+",
                "hash123"
            );

            await expect(medicalRecord.connect(requester1).requestAccess(1, "Need access for treatment"))
                .to.be.revertedWith("Requester profile not found");
        });
    });

    describe("Access Requests", function () {
        beforeEach(async function () {
            // Add a patient and requester for testing access
            await medicalRecord.addPatient(
                patient.address,
                "John Doe",
                30,
                "Male",
                "O+",
                "hash123"
            );

            await medicalRecord.connect(requester1).addRequester("Dr. Smith", "Doctor");
            await medicalRecord.connect(requester1).requestAccess(1, "Need access for treatment");
        });

        it("Should allow a patient to approve access", async function () {
          // Patient adds themselves
          await medicalRecord.addPatient(patient.address, "Patient Name", 30, "Male", "O+", "dataHash");
          
          // Requester adds themselves
          await medicalRecord.connect(requester1).addRequester("Requester Name", "Doctor");
          
          // Request access
          await medicalRecord.connect(requester1).requestAccess(1, "Need access for treatment");
  
          // Approve access
          await medicalRecord.connect(patient).approveAccess(1, requester1.address, 7); // Approve for 7 days
  
          // Check if the access request was approved
          const hasAccess = await medicalRecord.hasAccess(1, requester1.address);
          assert.equal(hasAccess, true, "Access should be granted after approval");
  
          // Check the status of the access request
          const request = await medicalRecord.accessRequests(1, requester1.address);
          assert.equal(request.status, 1, "Request should be approved (status should be 1)");
      });

        it("Should allow a patient to deny access", async function () {
            await medicalRecord.connect(patient).denyAccess(1, requester1.address);
            const request = await medicalRecord.accessRequests(1, requester1.address);
            expect(request.status).to.equal(2); // Denied status
        });

        it("Should allow requesters to access patient data if approved", async function () {
            await medicalRecord.connect(patient).approveAccess(1, requester1.address, 30);
            const data = await medicalRecord.connect(requester1).getPatientData(1);
            expect(data[3]).to.equal("John Doe"); // Checking patient name
        });

        it("Should not allow access if not approved", async function () {
            await expect(medicalRecord.connect(requester2).getPatientData(1))
                .to.be.revertedWith("Access not granted");
        });
    });
});
