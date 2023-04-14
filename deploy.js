const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");

  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PASSWORD
  ).connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");

  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("Deploying contract");

  const contract = await contractFactory.deploy();

  const fvNumber = await contract.retrieve();

  console.log(fvNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
