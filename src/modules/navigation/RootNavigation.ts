import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import React from 'react';

/**
 * Proxy methods for a navigation library
 */

export const isAppMountedRef = React.createRef<boolean>();

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function navigate(...args: any) {
  safetyNavigationCall(() => {
    navigationRef.current?.navigate(...args);
  });
}

export function getCurrentScreenName() {
  return safetyNavigationCall(() => {
    return navigationRef.current?.getCurrentRoute()?.name;
  });
}

export function push(...args: Parameters<(typeof StackActions)['push']>) {
  safetyNavigationCall(() => {
    navigationRef.current?.dispatch(StackActions.push(...args));
  });
}
export function pop(...args: Parameters<(typeof StackActions)['pop']>) {
  safetyNavigationCall(() => {
    navigationRef.current?.dispatch(StackActions.pop(...args));
  });
}

export function navigationDispatch(
  ...args: Parameters<NavigationContainerRef<any>['dispatch']>
) {
  safetyNavigationCall(() => {
    navigationRef.current?.dispatch(...args);
  });
}

/**
 * Helper for safe navigation
 * @param successCallback
 */
function safetyNavigationCall(successCallback: () => void | string) {
  if (canUseNavigation()) {
    return successCallback();
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
    setTimeout(() => {
      return safetyNavigationCall(successCallback);
    }, 100);
  }
}

/**
 * Check navigation render object
 */
function canUseNavigation() {
  return !!(isAppMountedRef.current && navigationRef.current);
}

/**
 * Call this function when you want to navigate to a specific route AND reset the navigation history.
 *
 * That means the user cannot go back. This is useful for example to redirect from a splashscreen to
 * the main screen: the user should not be able to go back to the splashscreen.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
export function navigateAndReset(routeName: string, params: any) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: routeName, params}],
    }),
  );
}

export function navigateBack() {
  safetyNavigationCall(() => {
    navigationRef.current?.goBack();
  });
}
