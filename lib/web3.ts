import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { fallback, http } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';

import {
  ETH_CHAIN_ID,
  ETH_RPC_URL,
  WALLETCONNECT_PROJECT_ID,
} from '@/utils/constants';

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

const rpcs = [http(ETH_RPC_URL), http()];

export const wagmiConfig = getDefaultConfig({
  appName: 'wPokt monitor',
  projectId,
  chains: [DEFAULT_CHAIN],
  transports: {
    [ETH_CHAIN_ID]: fallback(rpcs),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});
