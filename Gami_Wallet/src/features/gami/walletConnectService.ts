import { useConnect, useAccount, useDisconnect } from 'wagmi';

export function useWalletConnection() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  function connectWallet() {
    if (!connectors?.length) throw new Error('No connectors available');
    connect({ connector: connectors[0] });
  }

  return {
    address,
    isConnected,
    connectWallet,
    disconnect,
  };
}
