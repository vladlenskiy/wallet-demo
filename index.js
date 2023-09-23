/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);
