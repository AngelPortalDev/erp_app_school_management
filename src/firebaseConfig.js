// src/firebaseConfig.js

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

export const firebaseConfig = {
    apiKey: 'AIzaSyD2iJjXBNGTROVbi3BUuDJkGC7FeFtX2Mc',
    authDomain: 'teachermanagment-f5f92.firebaseapp.com',
    projectId: 'teachermanagment-f5f92',
    storageBucket: 'teachermanagment-f5f92.appspot.com',
    messagingSenderId: '475371597142',
    appId: '1:475371597142:android:48c9a51e8252a65af57af7',
  };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = getMessaging(app);

export { app, messaging };
