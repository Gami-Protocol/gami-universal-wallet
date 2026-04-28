import EthereumProvider from '@walletconnect/ethereum-provider';

let provider: any = null;

export async function connectWallet() {
  provider = await EthereumProvider.init({
    projectId: 'YOUR_PROJECT_ID',
    chains: [1],
    showQrModal: true,
  });

  await provider.enable();

  const accounts = provider.accounts;
  return accounts[0];
}

export function getProvider() {
  return provider;
}
