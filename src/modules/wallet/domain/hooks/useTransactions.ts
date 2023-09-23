import {
  arbitrumRpc,
  ethRpc,
  Networks,
  polygonRpc,
  Transactions,
  Wallet,
} from './useWallet';
import {
  getGasLimit,
  getGasPrice,
  getNonce,
  sendTransaction,
  signTransaction,
} from 'react-native-web3-wallet';

//todo move to .env
const etherscanKey = 'XVBQ78XR4UBIBTWGHUQ3K6Y4EGGMMUKBZS';
const polygonscanKey = '4XC13YZY2PYAIS1YGN5RBZK17TD4G96HNQ';
const arbitrumKey = 'ZW9ZF5A8ZK3KZQ5V9HQAXPFE2S8XRRI1VY';
//

export type Network = Networks.ETH | Networks.POLYGON | Networks.ARBITRUM;
export interface Options {
  toAddress: string;
  fromAddress?: string;
  wallet: Wallet;
  password: string;
  rpcURL: string;
  amount: string;
  chainId: number;
}

export function useTransactions() {
  const getTransactions = async (
    address: string,
  ): Promise<Transactions | null> => {
    try {
      const ethResponse = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${etherscanKey}`,
      );
      const polygonResponse = await fetch(
        `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${polygonscanKey}`,
      );
      const arbitrumResponse = await fetch(
        `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${arbitrumKey}`,
      );

      const eth = await ethResponse.json();
      const arb = await arbitrumResponse.json();
      const polygon = await polygonResponse.json();

      return {
        [Networks.ETH]: eth.result,
        [Networks.ARBITRUM]: arb.result,
        [Networks.POLYGON]: polygon.result,
      };
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const signTx = async ({
    toAddress,
    fromAddress,
    wallet,
    password,
    rpcURL,
    amount,
    chainId,
  }: Options) => {
    //todo remove hello world
    const data = '0x' + Buffer.from('hello world').toString('hex');

    if (wallet && fromAddress && amount && toAddress && password) {
      const gasPriceRes = await getGasPrice(rpcURL);
      const gasLimit = await getGasLimit(
        rpcURL,
        fromAddress,
        toAddress,
        amount,
        data,
      );
      const nonce = await getNonce(rpcURL, fromAddress);
      if (gasPriceRes && gasPriceRes.gasPrice) {
        return await signTransaction(
          JSON.stringify(wallet.keystore),
          password,
          nonce,
          gasLimit,
          gasPriceRes.gasPrice,
          toAddress,
          chainId,
          amount,
          data,
        );
      }
    }
    return null;
  };

  const resolveNetwork = (network: Network) => {
    if (network === Networks.ETH) {
      return {rpcURL: ethRpc, chainId: 1};
    }
    if (network === Networks.POLYGON) {
      return {rpcURL: polygonRpc, chainId: 137};
    }
    if (network === Networks.ARBITRUM) {
      return {rpcURL: arbitrumRpc, chainId: 42161};
    }
    return {rpcURL: ethRpc, chainId: 1};
  };

  const sendToken = async (
    network: Network,
    toAddress: string,
    wallet: Wallet,
    password: string,
    amount: string,
  ) => {
    try {
      const {rpcURL, chainId} = resolveNetwork(network);

      const signedTx = await signTx({
        toAddress,
        fromAddress: wallet?.address,
        wallet,
        password,
        rpcURL,
        amount,
        chainId,
      });
      if (signedTx) {
        return await sendTransaction(rpcURL, signedTx);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return {getTransactions, sendToken};
}
