const config = require('../src/config.json')
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
    // Fetch accounts from wallet - these are unlocked
    const accounts = await ethers.getSigners()

    // Fetch network
    const { chainId } = await ethers.provider.getNetwork()
    console.log("Using chainId:", chainId)

    const BUSD = await ethers.getContractAt(
        "Token",
        config[chainId].BUSD.address
    );
    console.log(`BUSD Token fetched: ${BUSD.address}\n`);

    // Fetch the deployed BUSDHandler
    const busdHandler = await ethers.getContractAt('BUSDHandler', config[chainId].busdHandler.address)
    console.log(`BUSDHandler fetched: ${busdHandler.address}\n`)

    const sender = accounts[0]
    let transaction, receiver_balance
    
    // Approve and transfer BUSD to BUSDHandler
    transaction = await BUSD.connect(sender).approve(busdHandler.address, tokens(100))
    await transaction.wait()

    transaction = await busdHandler.connect(sender).receiveBUSD(BUSD.address, busdHandler.address, tokens(100))
    await transaction.wait()
    
    receiver_balance = await BUSD.connect(sender).balanceOf(busdHandler.address)
    console.log(`Transfer ${tokens(receiver_balance)} to ${busdHandler.address}\n`)

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});