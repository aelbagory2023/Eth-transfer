const { ethers } = require("ethers");
const { providers } = ethers;
const dotenv = require("dotenv");
dotenv.config();

// Step 1: Set up the Ethereum provider (Infura example)
//const provider = new providers.InfuraProvider("mainnet", process.env.INFURA_API_KEY);
const provider = new ethers.providers.JsonRpcProvider("https://base-mainnet.infura.io/v3/85e931233d114d1e9494915d56ec9d54");

// Step 2: Set up the sender's wallet using a private key
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Step 3: Define Uniswap Router Contract Address and ABI
const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap V2 Router Address
const UNISWAP_ROUTER_ABI = [
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
];

// Step 4: Set up the contract instance for Uniswap Router
const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, wallet);

// Step 5: Define the token address you're swapping to (DAI in this case)
const TOKEN_ADDRESS = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"; // DAI token address

// Step 6: Define the amount of ETH you're swapping
const amountInETH = ethers.utils.parseEther("0.001"); // Swap 0.001 ETH

// Step 7: Create the path for the swap (ETH -> DAI)
const path = [
    ethers.constants.AddressZero, // This represents WETH (wrapped ETH)
    TOKEN_ADDRESS
];

// Step 8: Define the recipient address (this is usually the sender's address)
const recipient = wallet.address;

// Step 9: Set the minimum amount of DAI you expect to receive (slippage protection)
const amountOutMin = 2; // For simplicity, we set to 0 for now. Normally you calculate this.

async function swapEthForTokens() {
    // Step 10: Set a reasonable deadline (typically the current time + 20 minutes)
    const deadline = Math.floor(Date.now() / 1000) + (60 * 20);

    try {
        // Step 11: Send the swap transaction
        const tx = await router.swapExactETHForTokens(
            amountOutMin,
            path,
            recipient,
            deadline,
            { value: amountInETH, gasLimit: 300000 } // Adjust gas limit as needed
        );

        console.log(`Transaction submitted: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Transaction mined in block ${receipt.blockNumber}`);

        // Check for Swap event
        const swapEvent = receipt.events.find(event => event.event === 'Swap');
        if (swapEvent) {
            console.log('Swap event detected:', swapEvent);
        } else {
            console.log('No Swap event detected.');
        }
    } catch (error) {
        console.error(`Error occurred during swap: ${error.message}`);
    }
}

swapEthForTokens();
