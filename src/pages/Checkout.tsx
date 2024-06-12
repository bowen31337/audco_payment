import React, { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { CartContext, CartContextType } from "../context/CartContext";
import ShoppingCart from "../components/ShoppingCart";
import Modal from "../components/Modal";
import "./Checkout.css";
import { Account, Connect, ConnectWallet } from "../components/ConnectWallet";
import { fetchExchangeRate } from "../utils/fetchExchangeRate";
import CoinCheckout from "../components/CoinCheckout";

const Checkout: React.FC = () => {
  const { cart } = useContext(CartContext) as CartContextType;
  const [isModalOpen, setModalOpen] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity!,
    0
  );

  const handlePayment = () => {
    setModalOpen(true);
  };

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [fetchingEx, setFetchingEx] = useState(false); // Replace with your logic to fetch exchange rate

  const updateExchangeRate = async () => {
    // Add logic to fetch updated exchange rate
    const newExchangeRate = await fetchExchangeRate();
    setExchangeRate(newExchangeRate);
  };

  useEffect(() => {
    setFetchingEx(true);
    fetchExchangeRate()
      .then((newExchangeRate) => {
        setExchangeRate(newExchangeRate);
      })
      .finally(() => {
        setFetchingEx(false);
      });
  }, []);

  const { isConnected } = useAccount();

  const [ownerAddress, setOwnerAddress] = useState(
    "0x64e830dd7aF93431C898eA9e4C375C6706bd0Fc5"
  );

  return (
    <div className="checkout">
      {isConnected && <Account />}
      <h1>Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - {item.quantity} x ${item.price}
              </li>
            ))}
          </ul>
          <p>Total: ${totalPrice.toFixed(2)}</p>
          <form>
            <div className="form-group">
              <label htmlFor="name">Paid to:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                style={{display:'block'}}
              />
            </div>
          </form>
          {isConnected ? (
            <button onClick={handlePayment}>Pay with AUDCO</button>
          ) : (
            <Connect />
          )}
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <CoinCheckout
          audcoAmount={totalPrice / exchangeRate!}
          onExchangeRateUpdate={updateExchangeRate}
          exchangeRate={exchangeRate!}
          seller={ownerAddress}
        />
      </Modal>
    </div>
  );
};

export default Checkout;
