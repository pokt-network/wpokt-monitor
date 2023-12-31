import {
  Box,
  Button,
  Divider,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

import useHealth from '@/hooks/useHealth';
import { ETH_CHAIN_ID, POKT_CHAIN_ID } from '@/utils/constants';

import { HashDisplay } from './HashDisplay';
import { Tile } from './Tile';
import { TimeAgo } from './TimeAgo';
import { TimeLeft } from './TimeLeft';

export const HealthPanel: React.FC = () => {
  const { healths, reload, loading } = useHealth();

  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack align="stretch">
      {!loading && isSmallScreen && (
        <VStack align="stretch" overflowX="auto" spacing={4}>
          {healths.map(health => {
            const lastSyncTime = health.updated_at;
            const isOnline =
              new Date(lastSyncTime).getTime() > Date.now() - 1000 * 60 * 10;
            const nextSyncTime = new Date(lastSyncTime).getTime() + 300 * 1000;

            return (
              <Tile
                key={health._id.toString()}
                entries={[
                  {
                    label: 'Validator ID',
                    value: health.validator_id,
                  },
                  {
                    label: 'Pokt Address',
                    value: (
                      <HashDisplay chainId={POKT_CHAIN_ID}>
                        {health.pokt_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Eth Address',
                    value: (
                      <HashDisplay chainId={ETH_CHAIN_ID}>
                        {health.eth_address}
                      </HashDisplay>
                    ),
                  },
                  {
                    label: 'Last Health Check',
                    value: <TimeAgo time={lastSyncTime} />,
                  },
                  {
                    label: 'Next Health Check',
                    value: <TimeLeft time={nextSyncTime} />,
                  },
                  {
                    label: 'Status',
                    value: (
                      <HStack>
                        <Box
                          w="10px"
                          h="10px"
                          borderRadius="50%"
                          bg={isOnline ? 'green.500' : 'red.500'}
                        />
                        <Text>{isOnline ? 'Online' : 'Offline'}</Text>
                      </HStack>
                    ),
                  },
                ]}
              />
            );
          })}
        </VStack>
      )}

      {!loading && !isSmallScreen && <Divider />}
      {!loading && !isSmallScreen && (
        <VStack align="stretch" overflowX="auto">
          <Table maxW="100%">
            <Thead>
              <Tr>
                <Th>Validator ID</Th>
                <Th>Pokt Address</Th>
                <Th>Eth Address</Th>
                <Th>Last Health Check</Th>
                <Th>Next Health Check</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {healths.map(health => {
                const lastSyncTime = health.updated_at;
                const isOnline =
                  new Date(lastSyncTime).getTime() >
                  Date.now() - 1000 * 60 * 10;
                const nextSyncTime =
                  new Date(lastSyncTime).getTime() + 300 * 1000;

                return (
                  <Tr key={health._id.toString()}>
                    <Td>{health.validator_id}</Td>
                    <Td>
                      <HashDisplay chainId={POKT_CHAIN_ID}>
                        {health.pokt_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <HashDisplay chainId={ETH_CHAIN_ID}>
                        {health.eth_address}
                      </HashDisplay>
                    </Td>
                    <Td>
                      <TimeAgo time={lastSyncTime} />
                    </Td>
                    <Td>
                      <TimeLeft time={nextSyncTime} />
                    </Td>
                    <Td>
                      <HStack>
                        <Box
                          w="10px"
                          h="10px"
                          borderRadius="50%"
                          bg={isOnline ? 'green.500' : 'red.500'}
                        />
                        <Text>{isOnline ? 'Online' : 'Offline'}</Text>
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </VStack>
      )}

      <Button isLoading={loading} onClick={() => reload()} colorScheme="blue">
        Reload
      </Button>
    </VStack>
  );
};
