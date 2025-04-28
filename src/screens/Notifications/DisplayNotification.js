import React, {useEffect} from 'react';
import {Alert, PermissionsAndroid, View, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DisplayNotification = () => {
  const navigation = useNavigation(); // Get the navigation prop

  // Request permission for notifications
  useEffect(() => {
    const requestPermissionAndroid = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getToken();
      }
    };
    requestPermissionAndroid();
  }, []);

  // Handle background notification and navigate to the right screen
  useEffect(() => {
    const handleBackgroundNotification = messaging().onNotificationOpenedApp(
      remoteMessage => {
        // Extract the data from the notification
        const screen = remoteMessage?.data?.screen; // "screen" could be any key based on your notification data
        if (screen) {
          // Navigate to the screen specified in the notification data
          navigation.navigate('Dashboard', {
            screen: 'NotificationsScreen',
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
          navigation.navigate('Dashboard', {
            screen: 'NotificationsScreen',
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
  }, [navigation]);

  // Listen for notifications when the app is in the foreground
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Extract notification data
      const title =
        remoteMessage?.data?.title || remoteMessage?.notification?.title;
      const body =
        remoteMessage?.data?.body || remoteMessage?.notification?.body;

      Alert.alert(title, body);
    });

    return unsubscribe;
  }, []);

  // Save FCM token to the server
  useEffect(() => {
    const saveFcmToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return 'No Authentication';
      }

      const fcmToken = await messaging().getToken();
      console.info('fcmToken', fcmToken);

      // Save token to your backend
    };
    saveFcmToken();
  }, []);

  const getToken = async () => {
    const FCMtoken = await messaging().getToken();
    console.log('FCMToken', FCMtoken);
  };

  return (
    <View>
      <Text /> {/* Your view content */}
    </View>
  );
};

export default DisplayNotification;
