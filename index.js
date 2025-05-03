/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store, {persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import { LogBox } from 'react-native';

// Suppress all related deprecated warnings
LogBox.ignoreLogs([
  'deprecated', // Catch any deprecation warning
]);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
 
});

const ReduxApp = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
