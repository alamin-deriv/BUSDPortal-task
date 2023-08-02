const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("BUSDHandler", () => {
    let token, accounts, deployer, receiver, busdHandler;

    beforeEach(async () => {
        const BUSDHandler = await ethers.getContractFactory("BUSDHandler");
        busdHandler = await BUSDHandler.deploy();
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("busd", "BUSD", 100);

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
    });



    describe("Receive BUSD Tokens", () => {
        let amount, transaction, result;

        describe("Success", () => {
            beforeEach(async () => {
                amount = tokens(100);
                transaction = await token
                    .connect(deployer)
                    .approve(busdHandler.address, tokens(10));
                await transaction.wait();
                transaction = await busdHandler
                    .connect(deployer)
                    .receiveBUSD(token.address, busdHandler.address, tokens(10));
                result = await transaction.wait();
            });
            it("Received token balances", async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(
                    tokens(90)
                );
                expect(await token.balanceOf(busdHandler.address)).to.equal(tokens(10));
            });

            it("Emits a Recevied event", async () => {
                const event = result.events[0];
                expect(event.event).to.equal("Transfer");

                const args = event.args;
                expect(args.from).to.equal(deployer.address);
                expect(args.to).to.equal(busdHandler.address);
                expect(args.value).to.equal(tokens(10));
            });
        });

        describe("Failure", () => {
            it("rejects insufficient balances", async () => {
                const invalidAmount = tokens(100000000);
                await expect(
                    token.connect(deployer).transfer(busdHandler.address, invalidAmount)
                ).to.reverted;
            });

            it("rejects invalid recipent", async () => {
                const invalidAmount = tokens(100);
                await expect(
                    token
                        .connect(deployer)
                        .transfer(
                            "0x0000000000000000000000000000000000000000",
                            invalidAmount
                        )
                ).to.reverted;
            });
        });
    });

    describe("Send BUSD Tokens", () => {
        let amount, transaction, result;

        describe("Success", () => {
            beforeEach(async () => {
                amount = tokens(100);
                transaction = await token
                    .connect(deployer)
                    .approve(busdHandler.address, tokens(100));
                await transaction.wait();
                transaction = await busdHandler
                    .connect(deployer)
                    .receiveBUSD(token.address, busdHandler.address, tokens(100));
                result = await transaction.wait();
                transaction = await token
                    .connect(deployer)
                    .approve(receiver.address, tokens(10));
                await transaction.wait();
                transaction = await busdHandler
                    .connect(deployer)
                    .forwardBUSD(token.address, receiver.address, tokens(10));
                result = await transaction.wait();
            });
            it("Sent token balances", async () => {
                expect(await token.balanceOf(busdHandler.address)).to.equal(
                    tokens(90)
                );
                expect(await token.balanceOf(receiver.address)).to.equal(tokens(10));
            });

            it("Emits a Sent event", async () => {
                const event = result.events[0];
                expect(event.event).to.equal("Transfer");

                const args = event.args;
                expect(args.from).to.equal(busdHandler.address);
                expect(args.to).to.equal(receiver.address);
                expect(args.value).to.equal(tokens(10));
            });
        });

        describe("Failure", () => {
            it("rejects insufficient balances", async () => {
                const invalidAmount = tokens(100000000);
                await expect(
                    token.connect(deployer).transfer(receiver.address, invalidAmount)
                ).to.reverted;
            });

            it("rejects invalid recipent", async () => {
                const invalidAmount = tokens(100);
                await expect(
                    token
                        .connect(deployer)
                        .transfer(
                            "0x0000000000000000000000000000000000000000",
                            invalidAmount
                        )
                ).to.reverted;
            });
        });
    });


});