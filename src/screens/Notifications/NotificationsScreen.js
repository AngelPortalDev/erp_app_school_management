import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const findRoutes = navigation.getState().routes;
  const notificationRoute = findRoutes.find(
    itemRoute => itemRoute.name === 'NotificationsScreen',
  );
  const title = notificationRoute?.params?.params?.title;
  const body = notificationRoute?.params?.params?.body;

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <Icon name="notifications-outline" size={28} color="#fff" />
        <Text style={styles.headerText}>Notification</Text>
      </View> */}

      <View style={styles.card}>
        <Text style={styles.title}>{title || 'No Title'}</Text>
        <Text style={styles.date}>May 6, 2025</Text>
        <Text style={styles.body}>{body || 'No message body available.'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef1f6',
  },
  header: {
    backgroundColor: '#2b61ff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginBottom: 14,
  },
  body: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
});

export default NotificationsScreen;
