import { ETH_CHAIN_ID, POKT_CHAIN_ID } from './constants';

export const shortenHex = (hex: string, maxChars: number = 10): string => {
  if (!hex) return '';
  if (hex.length <= maxChars + 2) return hex;
  return `${hex.slice(0, maxChars - 4)}…${hex.slice(-4)}`;
};

export const uniqueValues = (array: string[]): string[] => {
  const map: Record<string, boolean> = {};
  array.forEach(item => {
    map[item] = true;
  });
  return Object.keys(map);
};

export const humanFormattedDate = (date: Date | string | number): string => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const getEthTxLink = (txHash: string): string => {
  switch (ETH_CHAIN_ID) {
    case '1':
      return `https://etherscan.io/tx/${txHash}`;
    case '11155111':
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    case '31337':
    default:
      return ``;
  }
};

export const getPoktTxLink = (txHash: string): string => {
  switch (POKT_CHAIN_ID) {
    case 'mainnet':
      return `https://poktscan.com/tx/${txHash}`;
    case 'testnet':
      return `https://poktscan.com/testnet/tx/${txHash}`;
    default:
      return ``;
  }
};

export const getEthAddressLink = (address: string): string => {
  switch (ETH_CHAIN_ID) {
    case '1':
      return `https://etherscan.io/address/${address}`;
    case '11155111':
      return `https://sepolia.etherscan.io/address/${address}`;
    case '31337':
    default:
      return ``;
  }
};

export const getPoktAddressLink = (account: string): string => {
  switch (POKT_CHAIN_ID) {
    case 'mainnet':
      return `https://poktscan.com/account/${account}`;
    case 'testnet':
      return `https://poktscan.com/testnet/account/${account}`;
    default:
      return ``;
  }
};
