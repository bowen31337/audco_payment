import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import CartProvider from "./context/CartContext";
import Donation from "./pages/Donation";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  WagmiProvider,
  createConfig,
  http,
  useAccount,
  useConnect,
} from "wagmi";
import { base, mainnet, optimism, bscTestnet , bsc} from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";
const projectId = "3fbb6bba6f1de962d911bb5b5c9dba88";


const config = createConfig({
  chains: [bscTestnet, bsc],
  //   connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  connectors: [metaMask()],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
    // [bsc.id]: http(),
    // [base.id]: http(),
  },
});

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/donate" element={<Donation />} />

          </Routes>
        </CartProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
