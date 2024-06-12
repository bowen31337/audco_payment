import React, { useState } from "react";
import "./Donation.css";
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseUnits } from "viem";
import { Wallet } from "../components/ConnectWallet";

import tokenAbi from "./donateAbi.json";

const tokenAddress = "0xffD22536cf2F2b62480BcBB95fe6c1b8Ea0FA8F0";

const Donation: React.FC = () => {
  const [amount, setAmount] = useState(100);
  const [recipient, setRecipient] = useState(
    "0x64e830dd7aF93431C898eA9e4C375C6706bd0Fc5"
  );

  const { data: hash, writeContract: processPayment } = useWriteContract();

  const { isLoading, isSuccess, error } = useWaitForTransactionReceipt({
    hash,
  });

  const { address, isConnected } = useAccount();

  const {
    data,
    error: readError,
    isPending: readPending,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
    ],
  });

  console.log({ data, error, readError, readPending });

  const handleDonate = async () => {
    console.log({ tokenAbi, tokenAddress, amount });
    console.log("donate");
    processPayment(
      {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "transfer",
        args: [recipient, parseUnits(amount?.toString(), 18)],
      },
      {
        onSuccess: (data) => {
          console.log(data);
        },
        onError: (e) => {
          console.log(e);
        },
      }
    );

    refetch();
  };

  return (
    <div className="donation">
      <Wallet />
      <h1>Donate Tokens</h1>
      <form>
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            required
          />
        </div>

        {isConnected && (
          <button type="button" onClick={handleDonate}>
            Donate
          </button>
        )}
        {isLoading && <p>You are donating..</p>}
        {isSuccess && <p>Thanks for your donation</p>}
      </form>
    </div>
  );
};

export default Donation;
