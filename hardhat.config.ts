import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      // OZ Contracts v5.1+ ships Bytes.sol which uses the `mcopy` opcode,
      // available only when targeting the Cancun EVM. Without this
      // setting `npx hardhat compile` fails with DeclarationError 4619.
      evmVersion: "cancun",
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    base: {
      url: process.env.BASE_RPC || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
