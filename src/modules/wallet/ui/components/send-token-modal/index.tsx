import React, {useCallback, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {ActivityIndicator, Button} from 'react-native';
import * as S from './styles';
import {Network, useTransactions} from '../../../domain/hooks/useTransactions';
import {SendTokenBtnContainer} from '../../screens/styles';
import {Input} from '../../screens/create/styles';
import {Wallet} from '../../../domain/hooks/useWallet';
const containerStyles = {alignItems: 'center', justifyContent: 'center'} as any;

type Props = {
  modalRef: any;
  network: Network;
  wallet: Wallet;
  onRefresh: () => void;
};

export default function SendTokenModal({
  modalRef,
  network,
  wallet,
  onRefresh,
}: Props) {
  const [toAddress, setToAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setLoading] = useState(false);

  const {sendToken} = useTransactions();

  const onPress = useCallback(async () => {
    setLoading(true);
    sendToken(network, toAddress, wallet, password, amount).then(() => {
      modalRef.current.close();
      setLoading(false);
      onRefresh();
    });
  }, [
    amount,
    modalRef,
    network,
    onRefresh,
    password,
    sendToken,
    toAddress,
    wallet,
  ]);

  const resolveModalContent = useCallback(() => {
    if (isLoading) {
      return (
        <S.Container style={containerStyles}>
          <ActivityIndicator color={'black'} size={'large'} />
        </S.Container>
      );
    }
    return (
      <S.Container>
        <S.Title>SEND TOKEN MODAL</S.Title>
        <S.Label>Selected Network: {network}</S.Label>
        <Input
          placeholder={'Address'}
          value={toAddress}
          onChangeText={setToAddress}
        />
        <Input
          placeholder={'Password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Input placeholder={'Amount'} value={amount} onChangeText={setAmount} />
        <SendTokenBtnContainer>
          <Button title={'SEND TOKEN'} onPress={onPress} color={'white'} />
        </SendTokenBtnContainer>
      </S.Container>
    );
  }, [amount, isLoading, network, onPress, password, toAddress]);

  return (
    <Modalize ref={modalRef} adjustToContentHeight={true}>
      {resolveModalContent()}
    </Modalize>
  );
}
