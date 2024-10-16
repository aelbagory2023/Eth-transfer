
const { ethers } = require("ethers");
const { providers } = ethers;
const dotenv = require("dotenv");

dotenv.config();
// Step 1: Set up the Ethereum provider (Infura example)
//const provider = new providers.InfuraProvider("mainnet", process.env.INFURA_API_KEY);
const provider = new ethers.providers.JsonRpcProvider("https://base-mainnet.infura.io/v3/85e931233d114d1e9494915d56ec9d54");

// Step 2: Set up the sender's wallet using a private key
const senderPrivateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(senderPrivateKey, provider);

// Step 3: Set up the recipient address and amount
const recipientAddress = "0x8CA5ef709dDC88192078DaC19211eF5f7bD2123A"; // Replace with the recipient's address
const tokenContractAddress = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"; // Replace with the ERC-20 token contract address
const amountInTokens = ethers.utils.parseUnits("2", 18); // Send 2 DAI tokens

const erc20ABI = [
    "function transfer(address to, uint256 amount) external returns (bool)"
];

// Step 5: Create a contract instance
const tokenContract = new ethers.Contract(tokenContractAddress, erc20ABI, wallet);

// Step 6: Create and send the token transfer transaction
async function sendTokens() {
    try {
        // Step 7: Send the token transfer transaction
        const transactionResponse = await tokenContract.transfer(recipientAddress, amountInTokens);

        // Step 8: Wait for the transaction to be mined
        await transactionResponse.wait();

        console.log(`Token transfer successful: ${transactionResponse.hash}`);
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }
}

sendTokens();