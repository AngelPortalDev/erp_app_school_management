import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import { BASE_URL } from '@env';

const AnnounceMentScreen = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAnnoucement = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return ('No Authentication');
      }

      const response = await Axios.get(`${BASE_URL}/listannouncement/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('getTeacherProfileData', response.data.announcements);
      setAnnouncements(response.data.announcements);
      setLoading(false);
    } catch (err) {
      console.log(err, 'error')
    }
  };

  useEffect(() => {
    getAnnoucement();
  }, []);

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]+>/g, '').trim();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AnnouncementDetails', { announcement: item })}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.subTitle}>Angel Portal Private Limited</Text>
            <Text style={styles.hrNotification}>HR NOTIFICATION</Text>
          </View>

          {/* <View style={styles.iconRow}>
            <View style={styles.iconBox}>
              <Ionicons name="thumbs-up-outline" size={18} color="#555" />
              <Text style={styles.iconText}>{item.likes_count || 0}</Text>
            </View>
            <View style={styles.iconBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#555" />
              <Text style={styles.iconText}>{item.comments_count || 0}</Text>
            </View>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>📢 Announcements</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 20 }} />
      ) : announcements.length > 0 ? (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No announcements at the moment</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fa',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2e3a59',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2e3a59',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  hrNotification: {
    fontSize: 12,
    color: '#2b61ff',
    fontWeight: '600',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconText: {
    fontSize: 13,
    marginLeft: 4,
    color: '#555',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
});

export default AnnounceMentScreen;
