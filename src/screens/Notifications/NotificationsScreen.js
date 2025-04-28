// src/screens/NotificationsScreen.js

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const NotificationsScreen = ({route}) => {
  // const { title, body } = route.params || {};

  const navigation = useNavigation();

  const findRoutes = navigation.getState().routes;
  const notificationRoute = findRoutes.find(
    itemRoute => itemRoute.name === 'NotificationsScreen',
  );
  const title = notificationRoute.params.params.title;
  const body = notificationRoute.params.params.body;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{String(title || 'No Title')}</Text>
      <Text style={styles.body}>{String(body || 'No Body')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default NotificationsScreen;
