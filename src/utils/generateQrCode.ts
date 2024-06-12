import QRCodeStyling from 'qr-code-styling';
import { generateRawTransaction } from './generateRawTransaction';

export const generateQrCode = async (audcoAmount: number, sellerAddress: string) => {
  const rawTransaction = await generateRawTransaction(audcoAmount, sellerAddress);

  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: JSON.stringify(rawTransaction),
  });

  const qrCodeContainer = document.getElementById('qr-code');
  if (qrCodeContainer) {
    qrCodeContainer.innerHTML = '';
    qrCode.append(qrCodeContainer);
  }
};
