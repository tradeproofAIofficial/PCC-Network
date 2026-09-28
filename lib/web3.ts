import { BrowserProvider, Contract } from "ethers";

export const PCC_CONTRACT_ADDRESS =
  "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

export const PCC_CONTRACT_ABI = [
  "function lockContract(bytes32 contractId, bytes32 preCommitment, bytes32 methodologyHash)",
];

type EthereumWindow = Window & {
  ethereum?: unknown;
};

export async function connectWallet() {
  if (typeof window === "undefined") {
    throw new Error("Wallet connection is only available in the browser.");
  }

  const ethereum = (window as EthereumWindow).ethereum;

  if (!ethereum) {
    throw new Error("No Ethereum wallet detected.");
  }

  const provider = new BrowserProvider(ethereum as never);

  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();

  return {
    provider,
    signer,
    address: await signer.getAddress(),
  };
}

export async function getPCCContract() {
  const { signer } = await connectWallet();

  if (!PCC_CONTRACT_ADDRESS) {
    throw new Error("PCC contract address has not been configured.");
  }

  return new Contract(
    PCC_CONTRACT_ADDRESS,
    PCC_CONTRACT_ABI,
    signer
  );
}