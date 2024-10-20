import MedicalRecord from "../contracts/MedicalRecord.json";

// Ensure environment variables are loaded
// dotenv.config();

const contractABI = MedicalRecord.abi;

export const getContractABI = () => {
  try {
    return contractABI;  // Simply return contractABI, not contractABI.abi
  } catch (error) {
    console.error('Error loading contract ABI:', error);
    return null;
  }
};

export const getContractConfig = () => {
  return {
    address: "your contract address", // Hardcoded for now, could use environment variable
    abi: getContractABI(),
  };
};
