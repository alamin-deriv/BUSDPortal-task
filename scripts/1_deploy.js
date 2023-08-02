// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory('Token')
  const BUSDHandler = await ethers.getContractFactory('BUSDHandler')

 // Fetch accounts
 const accounts = await ethers.getSigners();

 console.log(
   `Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`
 );

 // Deploy contracts
  const BUSD = await Token.deploy("busd", "BUSD", "1000");
  await BUSD.deployed();
  console.log(`BUSD Deployed to: ${BUSD.address}`);

  const busdHandler = await BUSDHandler.deploy();
  await busdHandler.deployed();
  console.log(`busdHandler Deployed to: ${busdHandler.address}`);

 }
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
