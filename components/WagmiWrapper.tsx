import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Heading,
  Spinner,
  Stack,
  Text,
  //useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import { WagmiProvider } from '@/components/WagmiProvider';
//import { usePocketWallet } from '@/contexts/PocketWallet';
import { useBalance } from '@/hooks/useBalance';
import { useIsConnected } from '@/hooks/useIsConnected';
import { DEFAULT_CHAIN } from '@/lib/web3';
import { PAUSED, POKT_CHAIN_ID } from '@/utils/constants';
import { shortenHex } from '@/utils/helpers';
import { PAGE_MAX_WIDTH, PAGE_PADDING_X } from '@/utils/theme';

//import { ConnectPoktModal } from './ConnectPoktModal';
import { EthIcon } from './EthIcon';
//import { PocketWalletModal } from './PocketWalletModal';
//import { PoktIcon } from './PoktIcon';

const InvalidNetwork: React.FC = () => {
  const { switchChain } = useSwitchChain();

  const onSwitch = useCallback(
    () => switchChain?.({ chainId: DEFAULT_CHAIN.id }),
    [switchChain],
  );

  const chainId = useChainId();

  const { address } = useAccount();
  //const { poktNetwork, poktAddress } = usePocketWallet();

  const isInvalidEthNetwork = useMemo(
    () => chainId !== DEFAULT_CHAIN.id,
    [chainId],
  );

  //const isInvalidPoktNetwork = useMemo(
  //  () => !!poktNetwork && poktNetwork !== POKT_CHAIN_ID,
  //  [poktNetwork],
  //);
  //
  const isInvalidPoktNetwork = false;

  if (!isInvalidEthNetwork && !isInvalidPoktNetwork) {
    return null;
  }

  if (!address) {
    //if (!address && !poktAddress) {
    return null;
  }

  return (
    <VStack w="100%" bg="red.100" p={6} my={6} borderRadius="md" spacing={4}>
      <Alert status="error" w="auto">
        <AlertIcon />
        <AlertDescription>
          Your{' '}
          {isInvalidEthNetwork
            ? 'ETH wallet is'
            : isInvalidPoktNetwork
              ? 'POKT wallet is'
              : 'wallets are'}{' '}
          connected to an unsupported network.
        </AlertDescription>
      </Alert>
      {isInvalidEthNetwork && (
        <>
          <Button
            onClick={onSwitch}
            leftIcon={<EthIcon boxSize="1.25rem" />}
            bg="gray.700"
            _hover={{ bg: 'gray.900' }}
            _active={{ bg: 'gray.900' }}
            color="white"
          >
            Switch ETH to {DEFAULT_CHAIN.name}
          </Button>
        </>
      )}
      {isInvalidPoktNetwork && (
        <Text>
          Please switch your POKT Wallet to <strong>{POKT_CHAIN_ID}</strong>
        </Text>
      )}
    </VStack>
  );
};

const WagmiConnectionManager: React.FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();

  const { openConnectModal } = useConnectModal();

  //const { poktAddress } = usePocketWallet();
  //const { isOpen, onOpen, onClose } = useDisclosure();

  if (PAUSED) {
    return (
      <>
        <Alert status="info" w="auto">
          <AlertIcon />
          <AlertDescription>
            Due to Pocket Network undergoing the Shannon upgrade, the bridge
            will be paused for 24 hours starting at 10am ET today (June 3rd)
          </AlertDescription>
        </Alert>
        {children}
      </>
    );
  }

  return (
    <>
      {/*(!address || !poktAddress) && (*/}
      {!address && (
        <VStack w="100%" bg="blue.100" p={6} my={6} borderRadius="md">
          <Alert status="info" w="auto">
            <AlertIcon />
            <AlertDescription>Please connect your wallet(s).</AlertDescription>
          </Alert>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            {!address && (
              <Button
                leftIcon={<EthIcon boxSize="1.25rem" />}
                onClick={openConnectModal}
                bg="gray.700"
                _hover={{ bg: 'gray.900' }}
                _active={{ bg: 'gray.900' }}
                color="white"
              >
                Connect ETH Wallet
              </Button>
            )}
            {/*!poktAddress && (
              <Button
                leftIcon={<PoktIcon boxSize="1.25rem" />}
                onClick={onOpen}
                colorScheme="blue"
              >
                Connect POKT Wallet
              </Button>
            )*/}
          </Stack>
        </VStack>
      )}
      <InvalidNetwork />
      {/*<ConnectPoktModal isOpen={isOpen} onClose={onClose} />*/}
      {children}
    </>
  );
};

const Header: React.FC = () => {
  const { balance, loading } = useBalance();
  const isConnected = useIsConnected();
  const { address } = useAccount();

  //const { poktAddress, poktBalance, isBalanceLoading, isPoktConnected } =
  //  usePocketWallet();

  const { openAccountModal } = useAccountModal();

  //const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack
      w="100%"
      justifyContent="space-between"
      spacing={4}
      py={4}
      direction={{ base: 'column', xl: 'row' }}
      align="center"
    >
      <Heading size="lg">wPOKT Bridge Monitor</Heading>
      <Stack
        spacing={4}
        direction={{ base: 'column', md: 'row' }}
        align="center"
      >
        {address && !PAUSED && (
          <VStack>
            <Button
              leftIcon={<EthIcon boxSize="1rem" />}
              bg="gray.700"
              _hover={{ bg: 'gray.900' }}
              _active={{ bg: 'gray.900' }}
              color="white"
              fontFamily="mono"
              onClick={openAccountModal}
            >
              <Text mb="-2px">{shortenHex(address, 10)}</Text>
            </Button>
            {isConnected && (
              <Text fontSize="sm">
                Balance:{' '}
                {loading ? (
                  <Spinner thickness="2px" speed="0.65s" size="xs" as="span" />
                ) : (
                  <Text as="span" fontWeight="bold">
                    {`${formatUnits(balance, 6)} wPOKT`}
                  </Text>
                )}
              </Text>
            )}
          </VStack>
        )}
        {/*poktAddress && !PAUSED && (
          <VStack>
            <Button
              leftIcon={<PoktIcon boxSize="1rem" />}
              colorScheme="blue"
              fontFamily="mono"
              onClick={onOpen}
            >
              <Text mb="-2px">{shortenHex(poktAddress, 10)}</Text>
            </Button>
            {isPoktConnected && (
              <Text fontSize="sm">
                Balance:{' '}
                {isBalanceLoading ? (
                  <Spinner thickness="2px" speed="0.65s" size="xs" as="span" />
                ) : (
                  <Text as="span" fontWeight="bold">
                    {`${formatUnits(poktBalance, 6)} POKT`}
                  </Text>
                )}
              </Text>
            )}
          </VStack>
        )*/}
      </Stack>
      {/*
      <PocketWalletModal isOpen={isOpen} onClose={onClose} />
      */}
    </Stack>
  );
};

export const WagmiWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider>
      <VStack
        px={PAGE_PADDING_X}
        w="100%"
        flex={1}
        maxW={PAGE_MAX_WIDTH}
        marginX="auto"
      >
        <Header />
        <WagmiConnectionManager>{children}</WagmiConnectionManager>
      </VStack>
    </WagmiProvider>
  );
};
