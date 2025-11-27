import { Spinner, VStack } from '@chakra-ui/react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { WagmiProvider as InnerWagmiProvider } from 'wagmi';

import { useIsMounted } from '@/hooks/useMounted';
import { wagmiConfig } from '@/lib/web3';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 5000,
      refetchInterval: 5000,
    },
  },
});

export const WagmiProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isMounted = useIsMounted();

  return isMounted ? (
    <InnerWagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </InnerWagmiProvider>
  ) : (
    <VStack w="100vw" h="100vh" justify="center" align="center">
      <Spinner color="blue.500" thickness="5px" w="5rem" h="5rem" speed="1s" />
    </VStack>
  );
};
