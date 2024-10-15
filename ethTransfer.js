
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
const recipientAddress = " "; // Replace with the recipient's address
const amountInEther = "0.01"; // Amount of ETH to send (in Ether)

// Step 4: Create and send the transaction
async function sendEth() {
    try {
        // Step 5: Specify the transaction details
        const tx = {
            to: recipientAddress,           // Recipient address
            value: ethers.utils.parseEther(amountInEther), // Amount of ETH in wei
        };

        // Step 6: Send the transaction
        const transactionResponse = await wallet.sendTransaction(tx);
        
        // Step 7: Wait for the transaction to be mined
        await transactionResponse.wait();

        console.log(`Transaction successful: ${transactionResponse.hash}`);
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }
}

sendEth();