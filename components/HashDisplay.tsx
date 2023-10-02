import { HStack } from '@chakra-ui/react';
import Image from 'next/image';
import { useMemo } from 'react';

import { ETH_NETWORK_LABEL, POKT_NETWORK_LABEL } from '@/utils/constants';

import { CopyText } from './CopyText';

const isETH = (chainId: string) =>
  chainId === '5' || chainId === '1' || chainId === '31337';

const isPOKT = (chainId: string) =>
  chainId === 'testnet' || chainId === 'mainnet' || chainId === 'localnet';

export const HashDisplay: React.FC<{ children: string; chainId: string }> = ({
  children,
  chainId,
}) => {
  const { label, logo, props } = useMemo(() => {
    let networkLabel = 'unknown';
    let networkLogo = '';
    let logoProps = {};
    if (isETH(chainId)) {
      networkLabel = `Ethereum ${ETH_NETWORK_LABEL}`;
      networkLogo = '/eth-logo.png';
      logoProps = {
        width: 9,
        height: 14,
        style: { height: '14px', width: '9px' },
      };
    } else if (isPOKT(chainId)) {
      networkLabel = `Pocket ${POKT_NETWORK_LABEL}`;
      networkLogo = '/pokt-logo.png';
      logoProps = {
        width: 14,
        height: 14,
        style: { height: 'auto', width: '14px' },
      };
    }

    return { label: networkLabel, logo: networkLogo, props: logoProps };
  }, [chainId]);

  return (
    <HStack
      spacing={1}
      bg="gray.100"
      px={2}
      py={1}
      borderRadius="full"
      justify="space-between"
      w="9rem"
    >
      {logo && (
        <HStack spacing={0} justify="center" w={4} flexShrink={0}>
          <Image src={logo} alt={label} {...props} />
        </HStack>
      )}
      <CopyText>{children}</CopyText>
    </HStack>
  );
};
