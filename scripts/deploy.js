const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const frameworkDeployer = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-framework");
const { network, ethers } = require("hardhat");
require("dotenv").config();

//to run this script:
//1) Make sure you've created your own .env file
//2) Make sure that you have your network specified in hardhat.config.js
//3) run: npx hardhat run scripts/deploy.js --network goerli
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // const provider = new hre.ethers.providers.JsonRpcProvider(
  //   process.env.GOERLI_URL
  // );

  // const sf = await Framework.create({
  //   chainId: (await provider.getNetwork()).chainId,
  //   provider1,
  // });
  let sfDeployer;

  sfDeployer = await frameworkDeployer.deployTestFramework();

  // GETTING SUPERFLUID FRAMEWORK SET UP

  // deploy the framework locally
  contractsFramework = await sfDeployer.getFramework();

  // initialize framework
  sf = await Framework.create({
    chainId: 31337,
    provider: ethers.provider,
    resolverAddress: contractsFramework.resolver, // (empty)
    protocolReleaseVersion: "test",
  });

  const signers = await hre.ethers.getSigners();
  // We get the contract to deploy
  const MoneyRouter = await hre.ethers.getContractFactory("MoneyRouter");
  //deploy the money router account using the proper host address and the address of the first signer
  const moneyRouter = await MoneyRouter.deploy(
    sf.settings.config.hostAddress,
    signers[0].address
  );

  await moneyRouter.deployed();

  console.log("MoneyRouter deployed to:", moneyRouter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
