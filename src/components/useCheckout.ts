import tokenAbi from "../../../artifacts/contracts/AUDCO.sol/AUDCO.json";
import paymentProcessorAbi from "../../../artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json";

import PaymentProcessorAbi from "./PaymentProcessorAbi.json";
import TokenAbi from "./TokenAbi.json";
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatUnits, parseUnits, parseAbi } from "viem";

export const useCheckout = () => {
  const { address, isConnected } = useAccount();
  const {
    data,
    error: readError,
    isPending: readPending,
    refetch,
    isFetched,
  } = useReadContracts({
    contracts: [
      {
        address: import.meta.env.VITE_AUDCO_TOKEN_ADDRESS!,
        abi: TokenAbi,
        // abi: parseAbi(["function balanceOf(address account)"]),
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        address: import.meta.env.VITE_AUDCO_TOKEN_ADDRESS!,
        abi: TokenAbi,
        // abi: parseAbi([
        //   "function allowance(address spender, uint256 allowance)",
        // ]),
        functionName: "allowance",
        args: [
          address as `0x${string}`,
          import.meta.env.VITE_PAYMENT_PROCESSOR_CONTRACT_ADDRESS,
        ],
      },
    ],
  });

  const [tokenBalanceData, tokenAllowance] = data || [];

  const rawBalance = tokenBalanceData?.result || 0;
  const rawAllowance = tokenAllowance?.result ?? 0;

  const balance = formatUnits(rawBalance as unknown as bigint, 18);
  const allowance = formatUnits(rawAllowance as unknown as bigint, 18);

  return {
    balance,
    allowance,
    refetch,
    isConnected,
    readPending,
    isFetched,
  };
};
export const useTransfer = (audcoAmount: number, seller: string) => {
  const { data: hash, writeContract: processPayment } = useWriteContract();
  const { isLoading: isConfirmingTransfer, isSuccess: isTransferConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const transferToken = () => {
    return new Promise<void>((res, rej) => {
      processPayment(
        {
          address: import.meta.env
            .VITE_PAYMENT_PROCESSOR_CONTRACT_ADDRESS as `0x${string}`,
          abi: PaymentProcessorAbi,
          //   abi: parseAbi([
          //     "function processPayment(address seller,uint256 amount)",
          //   ]),
          functionName: "processPayment",
          args: [
            // import.meta.env.VITE_SELLER_WALLET_ADDRESS!,
            seller,
            parseUnits(audcoAmount.toString(), 18),
          ],
        },
        {
          onSuccess: (data) => {
            console.log("transfer tx", data);
            res();
          },
          onError: (e) => {
            rej(e);
          },
          onSettled: () => {},
        }
      );
    });
  };

  return {
    transferToken,
    isConfirmingTransfer,
    isTransferConfirmed,
  };
};
export const useApprove = (audcoAmount: number) => {
  const { data: hash, writeContract: processPayment } = useWriteContract();
  const { isLoading: isConfirmingApprove, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const approveTransaction = () => {
    return new Promise<void>((res, rej) => {
      processPayment(
        {
          address: import.meta.env.VITE_AUDCO_TOKEN_ADDRESS as `0x${string}`,
          abi: TokenAbi,
          //   abi: parseAbi(["function approve(address seller,uint256 amount)"]),
          functionName: "approve",
          args: [
            import.meta.env.VITE_PAYMENT_PROCESSOR_CONTRACT_ADDRESS!,
            parseUnits(audcoAmount.toString(), 18),
          ],
        },
        {
          onSuccess: (data) => {
            console.log(data);
            res();
          },
          onError: (e) => {
            rej(e);
          },
        }
      );
    });
  };

  return {
    approveTransaction,
    isConfirmingApprove,
    isApproveConfirmed,
  };
};
