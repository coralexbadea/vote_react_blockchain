async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const initialSupply = ethers.utils.parseUnits("100000", 18);
    const FollowToken = await ethers.getContractFactory("FollowToken");
    const followToken = await FollowToken.deploy(initialSupply);
  
    console.log("FollowToken deployed to:", followToken.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });