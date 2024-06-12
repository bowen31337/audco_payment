import { createWalletClient, custom, getAddress } from 'viem';
import { bscTestnet } from 'viem/chains';

export const useMetamask = async () => {
  if (!window.ethereum) {
    alert('Please install Metamask!');
    return null;
  }

  const walletClient = createWalletClient({
    transport: custom(window.ethereum),
    chain: bscTestnet,
  });

  await walletClient.request({
    method: 'eth_requestAccounts',
  });

  const accounts = await walletClient.request({
    method: 'eth_accounts',
  });

  return {
    walletClient,
    account: getAddress(accounts[0]),
  };
};
