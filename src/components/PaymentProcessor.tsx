import React, { useEffect } from 'react';
import { useMetamask } from '../utils/useMetamask';
import { getContract, encodeFunctionData } from 'viem';
import abi from './PaymentProcessorAbi.json'; // Ensure you have the ABI JSON file for the PaymentProcessor contract

interface PaymentProcessorProps {
  audcoAmount: number;
  sellerAddress: string;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ audcoAmount, sellerAddress }) => {
  useEffect(() => {
    const processPayment = async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { walletClient, account } = await useMetamask();
      if (!walletClient || !account) return;

      const paymentProcessorAddress = '0xcf7C6bd4062961882Ca4219ACD7f45ff651D927C'; // Replace with actual contract address


      const data = encodeFunctionData({
        abi,
        functionName: 'processPayment',
        args: [sellerAddress, BigInt(audcoAmount * 10 ** 18)],
      });

      const txHash = await walletClient.sendTransaction({
        from: account,
        to: paymentProcessorAddress,
        data,
      });

      console.log('Transaction hash:', txHash);
    };

    processPayment();
  }, [audcoAmount, sellerAddress]);

  return null;
};

export default PaymentProcessor;
