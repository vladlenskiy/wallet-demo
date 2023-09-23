import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import screenNames from './screen-names';
import HomeScreen from '../wallet/ui/screens';
import CreateWalletScreen from '../wallet/ui/screens/create';
import {navigationRef} from './RootNavigation';
import LoaderScreen from '../shared/components/loader';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name={screenNames.loader}
          component={LoaderScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={screenNames.create}
          component={CreateWalletScreen}
          options={{headerLeft: () => null}}
        />
        <Stack.Screen
          name={screenNames.home}
          //@ts-ignore
          component={HomeScreen}
          options={{headerLeft: () => null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
