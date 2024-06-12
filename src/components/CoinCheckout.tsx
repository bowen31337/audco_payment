import React, { useEffect, useRef, useState } from "react";

import paymentProcessorAbi from "../../../artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json";
import tokenAbi from "../../../artifacts/contracts/AUDCO.sol/AUDCO.json";
import { useApprove, useCheckout, useTransfer } from "./useCheckout";

interface CheckoutProps {
  audcoAmount: number;
  exchangeRate: number;
  onExchangeRateUpdate: () => void;
  seller:string;
}

const Checkout: React.FC<CheckoutProps> = ({
  audcoAmount,
  exchangeRate,
  onExchangeRateUpdate,
  seller
}) => {
  const countdownRef = useRef(10);
  const countdownDisplayRef = useRef<HTMLParagraphElement | null>(null);
  const { refetch, isConnected, balance, allowance, readPending, isFetched } =
    useCheckout();
  const { transferToken, isConfirmingTransfer, isTransferConfirmed } =
    useTransfer(audcoAmount, seller);

  const { approveTransaction, isApproveConfirmed, isConfirmingApprove } =
    useApprove(audcoAmount);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (countdownRef.current === 1) {
        onExchangeRateUpdate();
        countdownRef.current = 60;
      } else {
        countdownRef.current -= 1;
      }
      if (countdownDisplayRef.current) {
        countdownDisplayRef.current.innerText = `${countdownRef.current} seconds`;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onExchangeRateUpdate]);

  if (isApproveConfirmed) {
    refetch();
  }

  if(isTransferConfirmed){
    window.location.replace('/')
  }

  return (
    <div>
      <p>Number of AUDCO tokens: {audcoAmount}</p>
      <p>Exchange rate: {exchangeRate}</p>
      <p>
        Token balance of AUDCO tokens::{" "}
        {readPending ? "reading balance" : parseFloat(balance)?.toFixed(0)}
      </p>
      <p> Allowance: {allowance}</p>
      <div style={{ width: "600px" }}>
        Paid to :{seller}
      </div>
      <p ref={countdownDisplayRef}>60 seconds</p>
      {isConfirmingApprove ? (
        <p>You are approving this transaction</p>
      ) : isConfirmingTransfer ? (
        <p> you are paying..</p>
      ) : (
        <button
          onClick={
            parseFloat(allowance) < audcoAmount
              ? () => approveTransaction()
              : () => transferToken()
          }
          disabled={!isConnected}
        >
          {parseFloat(allowance) < audcoAmount ? "approve" : "Pay"}
        </button>
      )}
    </div>
  );
};

export default Checkout;
