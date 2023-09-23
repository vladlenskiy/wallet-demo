import styled from '@emotion/native';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const Title = styled.Text`
  color: black;
  font-size: 20px;
  text-align: center;
  padding-bottom: 10px;
`;

export const Label = styled.Text`
  color: black;
`;

export const TransactionContainer = styled.View``;

export const SelectNetworkGroup = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: gray;
  border-radius: 24px;
  margin-bottom: 24px;
  margin-top: 12px;
`;

export const RemoveBtnContainer = styled.View`
  background-color: indianred;
  border-radius: 18px;
  margin-top: 24px;
`;

export const SendTokenBtnContainer = styled.View`
  background-color: lightblue;
  border-radius: 18px;
  margin-top: 8px;
  margin-bottom: 28px;
`;

export const InfoContainer = styled.View`
  background: lightgray;
  border-radius: 18px;
  padding: 8px;
  margin-bottom: 10px;
`;

export const Divider = styled.View`
  width: 100%;
  height: 1px;
  background: black;
  margin-vertical: 10px;
`;
