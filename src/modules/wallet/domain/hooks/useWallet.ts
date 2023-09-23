import storageService from '../../../core/services/StorageService';
import {
  bigNumberFormatUnits,
  createWallet,
  getBalance,
} from 'react-native-web3-wallet';

const sKey = 'wallet';
const ethPath = "m/44'/60'/0'/0/0";
export const ethRpc = 'https://eth.llamarpc.com';
export const polygonRpc = 'https://polygon-rpc.com';
export const arbitrumRpc = 'https://arb1.arbitrum.io/rpc';

export type Balances = {
  eth: string;
  matic: string;
  arbitrum: string;
};

export interface WalletResponse {
  mnemonic: Array<string>;
  shuffleMnemonic: Array<string>;
  address: string;
  publicKey?: string;
  privateKey?: string;
  keystore?: any;
}

export interface TransactionResponse {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  traceId: string;
  isError: string;
  errCode: string;
}

export type Transactions = {
  [Networks.ETH]: TransactionResponse[];
  [Networks.POLYGON]: TransactionResponse[];
  [Networks.ARBITRUM]: TransactionResponse[];
};

export type Wallet = WalletResponse | null;
export type Balance = Balances | null;

export enum Networks {
  ETH = 'ETHERIUM',
  POLYGON = 'POLYGON',
  ARBITRUM = 'ARBITRUM',
}

export function useWallet() {
  const create = async (password: string): Promise<Wallet> => {
    try {
      return await createWallet(password, ethPath);
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const getAllBalances = async (address: string): Promise<Balance> => {
    try {
      const ethBalance = await getBalance(ethRpc, address);
      const maticBalance = await getBalance(polygonRpc, address);
      const arbitrumBalance = await getBalance(arbitrumRpc, address);

      return {
        eth: bigNumberFormatUnits(ethBalance, 18),
        matic: bigNumberFormatUnits(maticBalance, 18),
        arbitrum: bigNumberFormatUnits(arbitrumBalance, 18),
      };
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const getSavedWallet = async (): Promise<Wallet> => {
    const savedWallet = (await storageService.getData(sKey)) as WalletResponse;
    return savedWallet ? savedWallet : null;
  };

  return {create, getAllBalances, getSavedWallet};
}
