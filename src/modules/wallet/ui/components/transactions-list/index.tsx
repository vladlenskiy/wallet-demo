import React from 'react';
import * as S from '../../screens/styles';
import {bigNumberFormatUnits} from 'react-native-web3-wallet';
import {TransactionResponse} from '../../../domain/hooks/useWallet';

type Props = {
  transactions: TransactionResponse[] | string;
};

type ItemProps = {
  item: TransactionResponse;
};

function TransactionsListItem({item}: ItemProps) {
  const amount = bigNumberFormatUnits(item.value, 18);
  return (
    <S.TransactionContainer>
      <S.Label>FROM:</S.Label>
      <S.Label>
        {item.from}
        {'\n'}
      </S.Label>
      <S.Label>TO:</S.Label>
      <S.Label>
        {item.to}
        {'\n'}
      </S.Label>
      <S.Label>AMOUNT:</S.Label>
      <S.Label>{amount}</S.Label>
      <S.Divider />
    </S.TransactionContainer>
  );
}

export default function TransactionsList({transactions}: Props) {
  if (
    transactions &&
    typeof transactions !== 'string' &&
    transactions.length !== 0
  ) {
    return (
      <S.InfoContainer>
        <S.Title>TRANSACTIONS</S.Title>
        {transactions.map(item => {
          return <TransactionsListItem item={item} />;
        })}
      </S.InfoContainer>
    );
  } else {
    return (
      <S.InfoContainer>
        <S.Title>TRANSACTIONS</S.Title>
        <S.Label>Empty</S.Label>
      </S.InfoContainer>
    );
  }
}
