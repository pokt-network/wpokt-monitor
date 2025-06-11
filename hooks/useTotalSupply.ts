import { useCallback } from 'react';
import useSWR from 'swr';
import { usePublicClient } from 'wagmi';

import { WRAPPED_POCKET_ABI } from '@/utils/abis';
import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';

export const useTotalSupply = (): {
  totalSupply: bigint;
  reload: () => void;
  loading: boolean;
} => {
  const publicClient = usePublicClient();

  const fetchTotalSupply = useCallback(async () => {
    if (!publicClient) return BigInt(0);
    try {
      const totalSupply = (await publicClient.readContract({
        address: WRAPPED_POCKET_ADDRESS as `0x${string}`,
        abi: WRAPPED_POCKET_ABI,
        functionName: 'totalSupply',
        args: [],
      })) as bigint;
      return totalSupply;
    } catch (error) {
      console.error(error);
      return BigInt(0);
    }
  }, [publicClient]);

  const {
    data: bnTotalSupply,
    isLoading,
    mutate,
  } = useSWR('totalSupply', fetchTotalSupply);

  return {
    totalSupply: bnTotalSupply || BigInt(0),
    reload: mutate,
    loading: isLoading,
  };
};
