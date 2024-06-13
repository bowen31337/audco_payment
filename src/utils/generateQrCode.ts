import QRCodeStyling from "qr-code-styling";
import { parseUnits, encodeFunctionData } from "viem";
import donateAbi from '../pages/donateAbi.json'; // Ensure this ABI includes the transfer function
import logo from './logo.png'
export const generateQrCode = (audcoAmount, sellerAddress) => {
  const valueInWei = parseUnits(audcoAmount.toString(), 18); // Convert to BigNumber

  // Encode the transfer function call
  const data = encodeFunctionData({
    abi: donateAbi,
    functionName: "transfer",
    args: [sellerAddress, valueInWei],
  });

  // Construct the Ethereum deep link
  const tokenMainNetAddress = "0xffD22536cf2F2b62480BcBB95fe6c1b8Ea0FA8F0"; // Your AUDCO token contract address on BSC Mainnet
  const chainId = '56'; // BSC Mainnet chain ID
  const deepLink = `https://metamask.app.link/send/${tokenMainNetAddress}@${chainId}/transfer?address=${sellerAddress}&uint256=${valueInWei}`;
  // const deepLink = `ethereum:${tokenMainNetAddress}@${chainId}/transfer?address=${sellerAddress}&uint256=${valueInWei}`;

  console.log(deepLink);

  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: deepLink,
    image: logo, // Replace with the path to your logo
    dotsOptions: {
      color: "#4267b2", // Example color for the dots
      type: "rounded"
    },
    backgroundOptions: {
      color: "#e9ebee" // Example background color
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20
    }
  });

  const qrCodeContainer = document.getElementById("qr-code");
  if (qrCodeContainer) {
    qrCodeContainer.innerHTML = "";
    qrCode.append(qrCodeContainer);
  }
};
