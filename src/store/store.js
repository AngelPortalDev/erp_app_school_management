import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import ProfileReducer from './profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
import { getDefaultConfig } from '@react-native/metro-config';

  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  };

//   added this because every chnages app get reload and logout
  const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer:{
        // auth:authReducer,
        auth:persistedAuthReducer,
        teacher:ProfileReducer,
    },
    middleware:getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck:{
                ignoreActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        })
});

export const persistor = persistStore(store);

export default store;
