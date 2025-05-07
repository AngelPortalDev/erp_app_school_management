import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './src/navigation/BottomTab';
import {useDispatch} from 'react-redux';
import AuthStack from './src/navigation/AuthStack';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginSuccess} from './src/store/authSlice';
import messaging from '@react-native-firebase/messaging';
import {Alert, PermissionsAndroid} from 'react-native';
import {BASE_URL} from '@env';
import Axios from 'axios';
import {navigationRef} from './src/helper/NavigationService';
import NotificationsScreen from './src/screens/Notifications/NotificationsScreen';
import CustomCamera from './src/screens/cameras/CustomCamera';
import TeacherDashboard from './src/screens/Dashboard/TeacherDashboard';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import StudentTab from './src/navigation/StudentTab';

// import { useState } from 'react';
const RootStack = createNativeStackNavigator();

const App = () => {
  const {isLoggedIn} = useSelector(state => state.auth);
  const {user_type} = useSelector(state => state.auth);
  const getRoleofPerson = user_type;
  // console.log('isLogged in', isLoggedIn);

  // useEffect(() => {
  //   const clearStorage = async () => {
  //     try {
  //       await AsyncStorage.clear();
  //       console.log('AsyncStorage cleared temporarily');
  //     } catch (error) {
  //       console.log('Error clearing storage:', error);
  //     }
  //   };

  //   clearStorage();
  // }, []);

  // To Implement Notification Logic

  useEffect(() => {
    const requestPermissionAndroid = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('permissio granted...');
      } else {
        // console.log('permission denied');
      }
    };
    requestPermissionAndroid();
  }, []);

  useEffect(() => {
    const handleBackgroundNotification = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('remoteMessage', remoteMessage);
        // Extract the data from the notification
        const screen = remoteMessage?.data?.screen;
        console.log('screen', screen);
        if (screen) {
          navigationRef.navigate('NotificationsScreen', {
            params: {
              title: remoteMessage.notification?.title,
              body: remoteMessage.notification?.body,
            },
          });
        }
      },
    );

    // Check if the app was launched from a terminated state by a notification
    const checkNotification = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        const screen = initialNotification?.data?.screen;
        if (screen) {
          navigationRef.navigate('NotificationsScreen', {
            params: {
              title: initialNotification.notification?.title,
              body: initialNotification.notification?.body,
            },
          });
        }
      }
    };

    // Check initial notification when the app is launched
    checkNotification();

    // Clean up the background notification listener
    return () => handleBackgroundNotification();
  }, []);

  // Listen for notifications when the app is in the foreground
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Display local notification (system-style)
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
        data: remoteMessage.data,
      });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function createChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
    createChannel();
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        // Optional: use screen from data
        navigationRef.navigate('NotificationsScreen');
      }
    });
  }, []);

  useEffect(() => {
    const saveFcmToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return 'No Authentication';
      }

      // const fcmToken = await messaging().getToken().then(item=>{
      //   console.log('Device FCM Token:', item);
      // }).catch(err=>console.log(err));
      const fcmToken = await messaging().getToken();
      console.info('fcmToken', fcmToken);

      // const response = await Axios.post(`${BASE_URL}/register-device/`,
      //   {fcm_token: fcmToken},
      //   {
      //     headers: {
      //       'Authorization': `Token ${token}`,
      //     },
      //   },
      // )
      // console.log('response',response);
      // Save token to your backend
    };
    saveFcmToken();
  }, []);

  // const getToken = async () => {
  //   const FCMtoken = await messaging().getToken();
  //   console.log('FCMToken', FCMtoken);
  // };

  return (
    <NavigationContainer ref={navigationRef}>
    <RootStack.Navigator>
      {isLoggedIn ? (
        <>
          {getRoleofPerson == 'teacher' ? (
            <>
              <RootStack.Screen
                name="BottomTab"
                component={BottomTab}
                options={{headerShown: false}}
              />
              <RootStack.Screen
                name="NotificationsScreen"
                component={NotificationsScreen}
                options={{headerShown: true, title: 'Notifications'}}
              />
            </>
          ) : (
            <RootStack.Screen
              name="StudentTab"
              component={StudentTab}
              options={{headerShown: true, title: 'StudentTab'}}
            />
          )}
        </>
      ) : (
        <RootStack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{headerShown: false}}
        />
      )}
      {/* <RootStack.Screen
      name="StudentTab"
      component={StudentTab}
      options={{headerShown:false}}
      /> */}
    </RootStack.Navigator>
  </NavigationContainer>
  );
};
export default App;
