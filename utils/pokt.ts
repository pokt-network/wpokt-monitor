import { bech32 } from 'bech32';

export function parsePokt(amount: string | number): bigint {
  return BigInt(Number(amount) * 1e6);
}

export function formatPokt(amount: string | bigint): string {
  return (BigInt(amount) / BigInt(1e6)).toString();
}

export const UPOKT = 1000000;

const poktPrefix = 'pokt';

export const bech32ToHex = (address: string): string => {
  const decoded = bech32.decode(address);
  if (decoded.prefix !== poktPrefix) {
    return '';
  }
  const hex = Buffer.from(bech32.fromWords(decoded.words)).toString('hex');
  return `0x${hex}`;
};
