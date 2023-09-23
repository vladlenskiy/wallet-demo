import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, RefreshControl, Text, View} from 'react-native';
import {exportPrivateKeyFromMnemonic} from 'react-native-web3-wallet';
import {use} from '@maticnetwork/maticjs';
import {Web3ClientPlugin} from '@maticnetwork/maticjs-ethers';
import {
  Balance,
  Networks,
  Transactions,
  useWallet,
  Wallet,
} from '../../domain/hooks/useWallet';
import storageService from '../../../core/services/StorageService';
import {navigationRef} from '../../../navigation/RootNavigation';
import screenNames from '../../../navigation/screen-names';
import LoaderScreen from '../../../shared/components/loader';
import {useNavigation} from '@react-navigation/native';
import * as S from './styles';
import TransactionsList from '../components/transactions-list';
import SendTokenModal from '../components/send-token-modal';
import {Network, useTransactions} from '../../domain/hooks/useTransactions';
const contentContainerStyle = {marginHorizontal: 20};

use(Web3ClientPlugin);

type Props = {
  route: {
    params: {
      wallet: Wallet;
      balance: Balance;
    };
  };
};

function HomeScreen({route}: Props) {
  const {params} = route;
  const navigation = useNavigation();

  const [wallet, setWallet] = useState<Wallet>(params.wallet || null);
  const [network, setNetwork] = useState<Network>(Networks.ETH);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transactions | null>(null);
  const [balance, setBalance] = useState<any>(params.balance || null);
  const [isRefreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const modalRef = useRef<any>(null);

  const {getSavedWallet, getAllBalances} = useWallet();
  const {getTransactions} = useTransactions();

  const getData = useCallback(async () => {
    const savedWallet = await getSavedWallet();

    if (savedWallet) {
      const _balance = await getAllBalances(savedWallet.address);
      const _transactions = await getTransactions(savedWallet?.address);
      const pKey = await exportPrivateKeyFromMnemonic(
        savedWallet.mnemonic.join(' '),
        "m/44'/60'/0'/0/0",
      );

      setPrivateKey(pKey);
      setBalance(_balance);
      setTransactions(_transactions);
      setWallet(savedWallet);
    }
  }, [getAllBalances, getSavedWallet, getTransactions]);

  const init = useCallback(async () => {
    setLoading(true);
    await getData();
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => init());
  }, []);

  const clear = () => {
    setWallet(null);
    storageService.setData('wallet', null);
    navigationRef &&
      navigationRef.current &&
      navigationRef.current.navigate(screenNames.create as never, {} as never);
  };

  const Information = useMemo(() => {
    if (wallet) {
      return (
        <S.InfoContainer>
          <S.Title>INFO</S.Title>
          <S.Label>
            Address: {wallet.address || ''}
            {'\n'}
          </S.Label>
          <Text>
            Private Key: {privateKey || ''}
            {'\n'}
          </Text>
          <S.Label>Mnemonic: {wallet.mnemonic || ''}</S.Label>
        </S.InfoContainer>
      );
    }
    return <></>;
  }, [privateKey, wallet]);

  const BalanceComponent = useMemo(() => {
    if (balance) {
      return (
        <S.InfoContainer>
          <S.Title>BALANCE</S.Title>
          {network === Networks.ETH && (
            <View>
              <S.Label>{Networks.ETH}</S.Label>
              <S.Label>{balance.eth || '0.00'}</S.Label>
            </View>
          )}
          {network === Networks.POLYGON && (
            <View>
              <S.Label>{Networks.POLYGON}</S.Label>
              <S.Label>{balance.matic || '0.00'}</S.Label>
            </View>
          )}
          {network === Networks.ARBITRUM && (
            <View>
              <S.Label>{Networks.ARBITRUM}</S.Label>
              <S.Label>{balance.arbitrum || '0.00'}</S.Label>
            </View>
          )}
        </S.InfoContainer>
      );
    }
    return <></>;
  }, [balance, network]);

  const resolveTransactions = useMemo(() => {
    if (transactions) {
      if (network === Networks.ETH) {
        return <TransactionsList transactions={transactions[Networks.ETH]} />;
      }
      if (network === Networks.ARBITRUM) {
        return (
          <TransactionsList transactions={transactions[Networks.ARBITRUM]} />
        );
      }
      if (network === Networks.POLYGON) {
        return (
          <TransactionsList transactions={transactions[Networks.POLYGON]} />
        );
      }
    }
  }, [network, transactions]);

  const onSelectNetwork = useCallback(
    (_network: Network) => {
      setNetwork(_network);
      getData();
    },
    [getData],
  );

  const onSendToken = useCallback(() => {
    modalRef && modalRef.current && modalRef.current.open();
  }, [modalRef]);

  const resolveTextColor = useCallback(
    (_network: Network) => {
      if (_network === network) {
        return 'white';
      }
      return 'black';
    },
    [network],
  );

  if (isLoading) {
    return <LoaderScreen />;
  }
  return (
    <>
      <S.Container
        contentContainerStyle={contentContainerStyle}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
        }>
        <S.SelectNetworkGroup>
          <Button
            title={Networks.ETH}
            color={resolveTextColor(Networks.ETH)}
            onPress={() => onSelectNetwork(Networks.ETH)}
          />
          <Button
            title={Networks.POLYGON}
            color={resolveTextColor(Networks.POLYGON)}
            onPress={() => onSelectNetwork(Networks.POLYGON)}
          />
          <Button
            title={Networks.ARBITRUM}
            color={resolveTextColor(Networks.ARBITRUM)}
            onPress={() => onSelectNetwork(Networks.ARBITRUM)}
          />
        </S.SelectNetworkGroup>
        {Information}
        {BalanceComponent}
        {resolveTransactions}
        <S.RemoveBtnContainer>
          <Button title={'REMOVE'} onPress={clear} color={'white'} />
        </S.RemoveBtnContainer>
        <S.SendTokenBtnContainer>
          <Button title={'SEND TOKEN'} onPress={onSendToken} color={'white'} />
        </S.SendTokenBtnContainer>
      </S.Container>
      <SendTokenModal
        modalRef={modalRef}
        network={network}
        wallet={wallet}
        onRefresh={onRefresh}
      />
    </>
  );
}

export default HomeScreen;
