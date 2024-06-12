import QRCodeStyling from "qr-code-styling";
import { encodeFunctionData, parseUnits } from "viem";
import { ethers } from "ethers";
import paymentProcessorAbi from "../../../artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json";
import tokenAbi from "../../../artifacts/contracts/AUDCO.sol/AUDCO.json";

export const generateQrCode = (audcoAmount: number, sellerAddress: string) => {
  const valueInWei = parseUnits(audcoAmount.toString(), 18);

  // Encode the processPayment function call
  /* The code snippet `const data = encodeFunctionData({ abi: tokenAbi.abi, functionName: "transfer",
args: [sellerAddress, valueInWei] });` is encoding the function call to the `transfer` function of
the AUDCO token contract. */
  //   const data = encodeFunctionData({
  //     abi: tokenAbi.abi,
  //     functionName: "transfer",
  //     args: [sellerAddress, valueInWei],
  //   });

  const iface = new ethers.Interface(paymentProcessorAbi.abi);
  const data = iface.encodeFunctionData("processPayment", [
    sellerAddress,
    valueInWei,
  ]);

  // Construct the Ethereum deep link
  const paymentProcessorAddress = "0x822101226DEA17C238dfe15290Bd16dB4dafDE5c"; // Replace with your PaymentProcessor contract address
  const tokenAddress = "0x9333d7229eeC6c777CFaF04A96fd547C2dAc44D8"; // Replace with your AUDCO token contract address
  //   const chainId = '56'; // BSC Mainnet chain ID
  const chainId = "97"; // BSC Testnet chain ID
  const deepLink = `ethereum:${paymentProcessorAddress}@${chainId}?value=0&data=${data}&token=${tokenAddress}`;
  //   const deepLink = `ethereum:${paymentProcessorAddress}@${chainId}?value=0&data=${data}`;

  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: deepLink,
  });

  const qrCodeContainer = document.getElementById("qr-code");
  if (qrCodeContainer) {
    qrCodeContainer.innerHTML = "";
    qrCode.append(qrCodeContainer);
  }
};
