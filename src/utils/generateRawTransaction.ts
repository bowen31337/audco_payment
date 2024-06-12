import { ethers } from 'ethers';
import paymentProcessorAbi from "../../../artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json";

export const generateRawTransaction = async (audcoAmount: number, sellerAddress: string) => {
  const providerUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
  const paymentProcessorAddress = '0x822101226DEA17C238dfe15290Bd16dB4dafDE5c'; // Replace with your PaymentProcessor contract address
  const valueInWei = ethers.parseUnits(audcoAmount.toString(), 18);

  const provider = new ethers.JsonRpcProvider(providerUrl);
  const gasPrice = provider.estimateGas;

  const iface = new ethers.Interface(paymentProcessorAbi.abi);
  const data = iface.encodeFunctionData('processPayment', [sellerAddress, valueInWei]);

  const rawTransaction = {
    to: paymentProcessorAddress,
    value: '0x0',
    data: data,
    gasPrice: gasPrice,
    gasLimit: '0x033450', // estimate or set an appropriate gas limit
    chainId: 97, // BSC Testnet chain ID
  };

  return rawTransaction;
};
