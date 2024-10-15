
const { ethers } = require("ethers");
const { providers } = ethers;
const dotenv = require("dotenv");

dotenv.config();
// Step 1: Set up the Ethereum provider (Infura example)
const provider = new providers.InfuraProvider("mainnet", process.env.INFURA_API_KEY);
//const provider = new ethers.providers.JsonRpcProvider("https://base-mainnet.infura.io/v3/85e931233d114d1e9494915d56ec9d54");

// Step 2: Set up the sender's wallet using a private key
const senderPrivateKey = "0bb003fa69e42c9c110ccd18a931cf47fe5e10f72ac5165e67c3c2a2a0a1d55d";
const wallet = new ethers.Wallet(senderPrivateKey, provider);

// Step 3: Set up the recipient address and amount
const recipientAddress = "0xD47cA6282A48cfc125100A9B0f795f589dDAfbAB"; // Replace with the recipient's address
const tokenContractAddress = "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"; // Replace with the ERC-20 token contract address
const amountInTokens = ethers.utils.parseUnits("10.0", 18); // Replace with the amount of tokens to send

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