const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();

// Step 1: Set up the Ethereum provider (Base network)
const provider = new ethers.providers.JsonRpcProvider(
  "https://base-mainnet.infura.io/v3/85e931233d114d1e9494915d56ec9d54"
);

// Step 2: Set up the sender's wallet using a private key
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Step 3: Define Uniswap Router Contract Address and ABI for Base network (Uniswap V2)
const UNISWAP_ROUTER_ADDRESS = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"; // Uniswap V2 Router on Base
const UNISWAP_ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
];

// Step 4: Set up the contract instance for Uniswap Router
const router = new ethers.Contract(
  UNISWAP_ROUTER_ADDRESS,
  UNISWAP_ROUTER_ABI,
  wallet
);

// Step 5: Define the token addresses
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006"; // WETH on Base
const DAI_ADDRESS = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"; // DAI on Base

// Step 6: Define the amount of ETH you're swapping
const amountInETH = ethers.utils.parseEther("0.001"); // Swap 0.001 ETH

async function swapExactEthForTokens() {
  try {
    // Set a reasonable deadline (current time + 20 minutes)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    // For simplicity, we'll set a very low amountOutMin
    // In a real-world scenario, you should use a price oracle or other method to determine this value
    const amountOutMin = 1; // 1 wei of DAI

    // Define the path for the swap
    const path = [WETH_ADDRESS, DAI_ADDRESS];

    // Send the swap transaction
    const tx = await router.swapExactETHForTokens(
      amountOutMin,
      path,
      wallet.address,
      deadline,
      { value: amountInETH, gasLimit: 300000 }
    );

    console.log(`Transaction submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Transaction mined in block ${receipt.blockNumber}`);

    // Log all events
    for (const event of receipt.events) {
      console.log("Event:", event);
    }
  } catch (error) {
    console.error(`Error occurred during swap: ${error.message}`);
  }
}

swapExactEthForTokens();
