import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Button} from 'react-native';
import {useWallet} from '../../../domain/hooks/useWallet';
import screenNames from '../../../../navigation/screen-names';
import * as S from './styles';
import storageService from '../../../../core/services/StorageService';

export default function CreateWalletScreen() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const navigation = useNavigation();
  const {create, getAllBalances} = useWallet();

  const createWallet = useCallback(async () => {
    setTimeout(async () => {
      const wallet = await create(password);
      if (wallet) {
        const balance = await getAllBalances(wallet.address);
        storageService.setData('wallet', wallet).then(() => {
          navigation.navigate(
            screenNames.home as never,
            {wallet, balance} as never,
          );
        });
        setLoading(false);
      }
    });
  }, [create, getAllBalances, navigation, password]);

  const onPress = useCallback(async () => {
    setLoading(true);
    await createWallet();
  }, [createWallet]);

  if (isLoading) {
    return (
      <S.Container>
        <ActivityIndicator />
      </S.Container>
    );
  }
  return (
    <S.Container>
      <S.Input
        value={password}
        placeholder={'Password'}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button title={'CREATE WALLET'} onPress={onPress} />
    </S.Container>
  );
}
