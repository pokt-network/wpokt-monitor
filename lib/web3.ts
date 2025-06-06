import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import { sepolia, hardhat, mainnet, Chain } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { ETH_CHAIN_ID, WALLETCONNECT_PROJECT_ID, ETH_RPC_URL } from '@/utils/constants';

export const projectId = WALLETCONNECT_PROJECT_ID;

export const DEFAULT_CHAIN = (() => {
  switch (ETH_CHAIN_ID) {
    case '1':
      return mainnet;
    case '11155111':
      return sepolia;
    default:
      return hardhat;
  }
})();

type ChainProviderFn<TChain extends Chain = Chain> = (chain: TChain) => {
  chain: TChain;
  rpcUrls: RpcUrls;
} | null;

type RpcUrls = {
  http: readonly string[];
  webSocket?: readonly string[];
};


const customProvider: ChainProviderFn = (chain) => {
  if (chain.id !== Number(ETH_CHAIN_ID)) {
    return null;
  }

  return {
    chain,
    rpcUrls: {
      http: [ETH_RPC_URL],
    },
  };
};

const { publicClient, webSocketPublicClient } = configureChains(
  [DEFAULT_CHAIN],
  [customProvider, w3mProvider({ projectId }), publicProvider()],
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains: [DEFAULT_CHAIN] }),
  publicClient,
  webSocketPublicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, [DEFAULT_CHAIN]);
