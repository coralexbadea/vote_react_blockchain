async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Extend voting duration to 1 year (525,600 minutes) for testing
  const candidateNames = ["Alice", "Bob", "Charlie"];
  const durationMinutes = 525600; // 1 year

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidateNames, durationMinutes);

  console.log("Voting contract deployed to:", voting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });