import React from 'react';
import {use} from '@maticnetwork/maticjs';
import {Web3ClientPlugin} from '@maticnetwork/maticjs-ethers';
import StackNavigator from './modules/navigation';

// install web3 plugin
use(Web3ClientPlugin);

function App() {
  return <StackNavigator />;
}

export default App;
