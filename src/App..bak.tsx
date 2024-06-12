import React, { useEffect, useState } from "react";
import { ConnectWallet } from "./components/ConnectWallet";
import Checkout from "./components/CoinCheckout";
import { fetchExchangeRate } from "./utils/fetchExchangeRate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, mainnet, optimism, bscTestnet } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = "3fbb6bba6f1de962d911bb5b5c9dba88";

const config = createConfig({
  chains: [bscTestnet],
  //   connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  connectors: [metaMask()],
  transports: {
    [bscTestnet.id]: http(),
    // [optimism.id]: http(),
    // [base.id]: http(),
  },
});

const App: React.FC = () => {
  const [audcoAmount, setAudcoAmount] = useState<number>(100); // Replace with your logic to set amount
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
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <h1>Shopping Cart</h1>
        <ConnectWallet />
        <h2>Total price: AUD: {audcoAmount}</h2>
        {fetchingEx || (
          <Checkout
            audcoAmount={audcoAmount / exchangeRate!}
            exchangeRate={exchangeRate!}
            onExchangeRateUpdate={updateExchangeRate}
          />
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
