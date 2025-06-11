import {
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import Image from 'next/image';
import { formatUnits } from 'viem';

import { BurnPanel } from '@/components/BurnPanel';
import { HealthPanel } from '@/components/HealthPanel';
import { InvalidMintPanel } from '@/components/InvalidMintPanel';
//import { MintPanel } from '@/components/MintPanel';
import { Tile } from '@/components/Tile';
import useTotals from '@/hooks/useTotals';
import { useTotalSupply } from '@/hooks/useTotalSupply';
import { ETH_NETWORK_LABEL, POKT_NETWORK_LABEL } from '@/utils/constants';

const WrappedPocketPage: React.FC = () => {
  const { totals, loading } = useTotals();

  const { totalSupply, loading: loadingSupply } = useTotalSupply();

  return (
    <VStack align="stretch" w="100%" spacing={4} pt={0} pb={10}>
      <Text fontWeight="bold" w="100%" textAlign="center">
        Bridge between POKT on
        <Image
          src="/pokt-logo.png"
          alt="POKT"
          width={16}
          height={16}
          style={{
            display: 'inline-block',
            marginLeft: 5,
            marginRight: 5,
            width: 'auto',
            height: 'auto',
          }}
        />
        Pocket {POKT_NETWORK_LABEL} and WPOKT on
        <Image
          src="/eth-logo.png"
          alt="ETH"
          width={10}
          height={16}
          style={{
            display: 'inline-block',
            marginLeft: 5,
            marginRight: 5,
            width: '10px',
            height: '16px',
          }}
        />
        Ethereum {ETH_NETWORK_LABEL}
      </Text>

      <VStack minW="20rem" align="stretch" mx="auto">
        <Tile
          entries={[
            //{
            //  label: 'Total Minted',
            //  value: loading ? '…' : formatUnits(totals.mints, 6),
            //},
            {
              label: 'Total Supply',
              value: loadingSupply ? '…' : formatUnits(totalSupply, 6),
            },
            {
              label: 'Total Burnt',
              value: loading ? '…' : formatUnits(totals.burns, 6),
            },
            {
              label: 'Total Refunded',
              value: loading ? '…' : formatUnits(totals.invalidMints, 6),
            },
          ]}
        />
      </VStack>

      <Tabs>
        <HStack justify="center" w="100%">
          <TabList>
            {/*
            <Tab>
              <Text fontSize="lg">Mints</Text>
            </Tab>
            */}
            <Tab>
              <Text fontSize="lg">Burns</Text>
            </Tab>
            <Tab>
              <Text fontSize="lg">Refunds</Text>
            </Tab>
            <Tab>
              <Text fontSize="lg">Health</Text>
            </Tab>
          </TabList>
        </HStack>
        <TabPanels>
          {/*
          <TabPanel px={0}>
            <MintPanel />
          </TabPanel>
          */}
          <TabPanel px={0}>
            <BurnPanel />
          </TabPanel>
          <TabPanel px={0}>
            <InvalidMintPanel />
          </TabPanel>
          <TabPanel px={0}>
            <HealthPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default WrappedPocketPage;
