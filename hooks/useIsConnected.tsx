import { useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';

import { DEFAULT_CHAIN } from '@/lib/web3';

export const useIsConnected = (): boolean => {
  const { address } = useAccount();
  const chainId = useChainId();
  const isConnected = useMemo(
    () => !!address && chainId === DEFAULT_CHAIN.id,
    [address, chainId],
  );
  return isConnected;
};
