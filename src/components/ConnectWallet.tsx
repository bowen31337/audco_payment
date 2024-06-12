import { Connector } from "@wagmi/core";
import React from "react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useConnect,
  http,
  createConfig,
  WagmiProvider,
  useChainId,
} from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

export function Connect() {
  const chainId = useChainId();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <div className="buttons">
      {connectors.map((connector: Connector) => (
        <ConnectorButton
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector, chainId })}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

function ConnectorButton({
  connector,
  onClick,
  isLoading,
}: {
  connector: Connector;
  onClick: () => void;
  isLoading: boolean;
}) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <button
      className="button"
      disabled={!ready}
      onClick={onClick}
      type="button"
    >
      {connector.icon ? (
        <img src={connector.icon} alt={connector.name} />
      ) : (
        <p>{connector.name}</p>
      )}
    </button>
  );
}

export function Account() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const formattedAddress = formatAddress(address);

  return (
    <div className="row">
      <div className="inline">
        {ensAvatar ? (
          <img alt="ENS Avatar" className="avatar" src={ensAvatar} />
        ) : (
          <div className="avatar" />
        )}
        <div className="stack">
          {address && (
            <div className="text">
              {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
            </div>
          )}
          <div className="subtext">
            Connected to {connector?.name} Connector
          </div>
        </div>
      </div>
      <button className="button" onClick={() => disconnect()} type="button">
        Disconnect
      </button>
    </div>
  );
}

export function Wallet() {
  const { isConnected } = useAccount();
  return (
    <div className="container">{isConnected ? <Account /> : <Connect />}</div>
  );
}
function formatAddress(address?: string) {
  if (!address) return null;
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
}

export const ConnectWallet: React.FC = () => {
  return <Wallet />;
};
