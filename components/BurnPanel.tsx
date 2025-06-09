import { QuestionIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  HStack,
  Input,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { formatUnits, getAddress, parseUnits } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

import useAllBurns from '@/hooks/useAllBurns';
import { useBalance } from '@/hooks/useBalance';
import { useIsConnected } from '@/hooks/useIsConnected';
import { WRAPPED_POCKET_ABI } from '@/utils/abis';
import {
  ETH_CONFIRMATIONS,
  PAUSED,
  POKT_NETWORK_LABEL,
  WRAPPED_POCKET_ADDRESS,
} from '@/utils/constants';
import { getEthTxLink, humanFormattedDate } from '@/utils/helpers';

import { bech32ToHex } from '../utils/pokt';
import { HashDisplay } from './HashDisplay';
import { Pagination } from './Pagination';
import { Tile } from './Tile';

export const BurnPanel: React.FC = () => {
  const { burns, reload, loading, pagination } = useAllBurns();

  const isConnected = useIsConnected();
  const { balance } = useBalance();

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState('');
  const [address, setAddress] = useState('');
  const account = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const burnTokens = useCallback(async () => {
    if (!value) {
      toast({
        title: 'Error',
        description: 'Please enter a burn amount',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const amount = parseUnits(value, 6);
    if (amount > balance) {
      toast({
        title: 'Error',
        description: 'You do not have enough tokens to burn',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please enter a recipient address',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const hexAddress = bech32ToHex(address);
    if (!hexAddress) {
      toast({
        title: 'Error',
        description: 'Please enter a valid recipient address',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!account.address || !walletClient || !publicClient) return;
    try {
      setIsLoading(true);
      const recipient = getAddress(hexAddress);
      const txHash = await walletClient.writeContract({
        account: account.address,
        address: WRAPPED_POCKET_ADDRESS as `0x${string}`,
        abi: WRAPPED_POCKET_ABI,
        functionName: 'burnAndBridge',
        args: [amount, recipient],
      });

      const txLink = getEthTxLink(txHash);
      toast.closeAll();
      toast({
        title: 'Transaction sent',
        description: (
          <Text>
            Burning tokens, view on{' '}
            <Link isExternal href={txLink}>
              Etherscan
            </Link>{' '}
          </Text>
        ),
        status: 'loading',
        duration: null,
        isClosable: false,
      });
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      toast.closeAll();
      toast({
        title: 'Transaction successful. Your tokens are burnt!',
        description:
          'Please wait upto 30 min to recieve your POKT in your wallet',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast.closeAll();
      // eslint-disable-next-line no-console
      console.error(error);
      toast({
        title: 'Error',
        description: 'Error burning tokens, please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, value, address, toast, publicClient, walletClient, balance]);

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack align="stretch">
      <VStack align="stretch" py={8}>
        <Text>
          {`To burn your wPOKT tokens, follow these simple steps:`}
          <br />
          <br />
          {`Step 1: Enter Burn Amount and Recipient Pocket Address`}
          <br />
          {`In the input fields below, enter the amount of wPOKT tokens you want to burn and the recipient's Pocket address.`}
        </Text>
        <VStack align="start" maxW="30rem" my={4}>
          <Input
            placeholder="Burn Amount"
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <Input
            placeholder="Recipient Pocket Address"
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </VStack>
        <Text>
          {`Step 2: Click the "Burn" Button`}
          <br />
          {`After entering the required information, click the "Burn" button to initiate the burning process.`}
          <Button
            isLoading={isLoading}
            onClick={burnTokens}
            colorScheme="blue"
            maxW="30rem"
            px={8}
            my={4}
            display="flex"
            isDisabled={!isConnected || PAUSED}
          >
            Burn
          </Button>
          {`That's it! Your wPOKT tokens will be burned, and the equivalent POKT tokens on the Pocket ${POKT_NETWORK_LABEL} will be transferred to the recipient address.`}
        </Text>
      </VStack>

      {!loading && isSmallScreen && (
        <VStack align="stretch" overflowX="auto" spacing={4}>
          {burns.map(burn => (
            <Tile
              key={burn.transaction_hash + burn.log_index}
              entries={[
                {
                  label: 'Tx Hash',
                  value: (
                    <HashDisplay chainId={burn.sender_chain_id}>
                      {burn.transaction_hash}
                    </HashDisplay>
                  ),
                },
                {
                  label: 'Created At',
                  value: humanFormattedDate(burn.created_at),
                },
                {
                  label: 'Sender',
                  value: (
                    <HashDisplay chainId={burn.sender_chain_id}>
                      {burn.sender_address}
                    </HashDisplay>
                  ),
                },
                {
                  label: 'Recipient',
                  value: (
                    <HashDisplay chainId={burn.recipient_chain_id}>
                      {burn.recipient_address}
                    </HashDisplay>
                  ),
                },
                {
                  label: 'Amount',
                  value: formatUnits(BigInt(burn.amount), 6),
                },
                {
                  label: 'Status',
                  value: (
                    <Tooltip
                      label={
                        burn.status === 'pending'
                          ? `The transaction has ${burn.confirmations} confirmations out of a total of ${ETH_CONFIRMATIONS} required.`
                          : ''
                      }
                    >
                      <HStack spacing={1}>
                        <Text>{burn.status}</Text>
                        {burn.status === 'pending' && (
                          <QuestionIcon fontSize="xs" />
                        )}
                      </HStack>
                    </Tooltip>
                  ),
                },
                {
                  label: 'Return Tx Hash',
                  value: burn.return_transaction_hash ? (
                    <HashDisplay chainId={burn.recipient_chain_id}>
                      {burn.return_transaction_hash}
                    </HashDisplay>
                  ) : (
                    'N/A'
                  ),
                },
              ]}
            />
          ))}
        </VStack>
      )}

      {!loading && !isSmallScreen && <Divider />}
      {!loading && !isSmallScreen && (
        <VStack align="stretch" overflowX="auto">
          <Table maxW="100%">
            <Thead>
              <Tr>
                <Th>Tx Hash</Th>
                <Th>Created At</Th>
                <Th>Sender</Th>
                <Th>Recipient</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Return Tx Hash</Th>
              </Tr>
            </Thead>
            <Tbody>
              {burns.map(burn => (
                <Tr key={burn._id.toString()}>
                  <Td>
                    <HashDisplay chainId={burn.sender_chain_id}>
                      {burn.transaction_hash}
                    </HashDisplay>
                  </Td>
                  <Td>{humanFormattedDate(burn.created_at)}</Td>
                  <Td>
                    <HashDisplay chainId={burn.sender_chain_id}>
                      {burn.sender_address}
                    </HashDisplay>
                  </Td>
                  <Td>
                    <HashDisplay chainId={burn.recipient_chain_id}>
                      {burn.recipient_address}
                    </HashDisplay>
                  </Td>
                  <Td>{formatUnits(BigInt(burn.amount), 6)}</Td>
                  <Td>
                    <Tooltip
                      label={
                        burn.status === 'pending'
                          ? `The transaction has ${burn.confirmations} confirmations out of a total of ${ETH_CONFIRMATIONS} required.`
                          : ''
                      }
                    >
                      <HStack spacing={1}>
                        <Text>{burn.status}</Text>
                        {burn.status === 'pending' && (
                          <QuestionIcon fontSize="xs" />
                        )}
                      </HStack>
                    </Tooltip>
                  </Td>
                  <Td>
                    {burn.return_transaction_hash ? (
                      <HashDisplay chainId={burn.recipient_chain_id}>
                        {burn.return_transaction_hash}
                      </HashDisplay>
                    ) : (
                      'N/A'
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      )}

      <VStack spacing={4} mt={4} w="100%">
        <Pagination {...pagination} />
        <Button isLoading={loading} onClick={() => reload()} colorScheme="blue">
          Reload
        </Button>
      </VStack>
    </VStack>
  );
};
