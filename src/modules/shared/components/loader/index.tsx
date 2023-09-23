import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {View} from 'react-native';
import {useWallet} from '../../../wallet/domain/hooks/useWallet';
import screenNames from '../../../navigation/screen-names';

export default function LoaderScreen() {
  const navigation = useNavigation();
  const {getSavedWallet} = useWallet();

  const init = async () => {
    const savedWallet = await getSavedWallet();
    if (savedWallet) {
      navigation.navigate(screenNames.home as never, {} as never);
    } else {
      navigation.navigate(screenNames.create as never, {} as never);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={{flex: 1}}>
      <ActivityIndicator
        color={'black'}
        size={'large'}
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
      />
    </View>
  );
}
