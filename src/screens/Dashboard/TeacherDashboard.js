/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@env';

const TeacherDashboard = ({navigation}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAnnoucement = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return 'No Authentication';
      }

      const response = await Axios.get(`${BASE_URL}/listannouncement/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      // console.log('getTeacherProfileData', response.data.announcements);
      setAnnouncements(response.data.announcements);
      setLoading(false);
    } catch (err) {
      if(err.response){
        console.log('Error Status:', err.response.status);
        console.log('Error Headers:', err.response.headers)
        console.log('Error Data:', err.response.data);
      }
      console.log(err, 'error');
    }
  };

  useEffect(() => {
    getAnnoucement();
  }, []);

  if(loading){
    return <ActivityIndicator size="large" color="#4a90e2" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TimeTable')}>
            <Icon name="calendar-number-outline" size={30} color="#4a90e2" />
            <Text style={styles.cardValue}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AssignedClass')}>
            <FontAwesomeIcon
              name="calendar-check-o"
              size={30}
              color="#7b5dff"
            />
            <Text style={styles.cardValue}>Classes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AnnounceMentScreen')}>
            <Icon name="megaphone-outline" size={30} color="#f39c12" />
            <Text style={styles.cardValue}>Announcements</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Leave')}
            style={styles.card}>
            <Icon name="book-outline" size={30} color="#e74c3c" />
            <Text style={styles.cardValue}>Leave</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.announcementSection}>
          <View style={styles.announcementHeader}>
            <FontAwesomeIcon
              name="bullhorn"
              size={24}
              color="#7b5dff"
              style={{marginRight: 10}}
            />
            <Text style={styles.announcementTitle}>Announcements</Text>
          </View>

          {/* Single Announcement Item */}
          {announcements.map((item,index) => (
            <View style={styles.announcementItem} key={index}>
              <View style={styles.avatar} />
              <TouchableOpacity
                style={styles.announcementContent}
                onPress={() => navigation.navigate('AnnouncementDetails',{announcement:item})}>
                <Text style={styles.announcementText} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.announcementDate}>{item.created_at}</Text>
                <Text style={styles.notificationType}>HR NOTIFICATION</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* View More Button */}
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() =>
              navigation.navigate('Dashboard', {screen: 'AnnounceMentScreen'})
            }>
            <Text style={styles.viewMoreText}>VIEW MORE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* <View style={styles.card}> */}
      {/* <Image source={require('../../../assets/AuthenticationImages/Home.png')} style={styles.image} />
        <Text style={styles.heading}>Welcome to E-Ascencia</Text>
        <Text style={styles.subText}>Your all-in-one platform for teacher management and performance tracking</Text> */}

      {/* Login Button */}
      {/* <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity> */}

      {/* Register Button */}
      {/* <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate('signup')}
        >
          <Text style={styles.buttonTextRegister}>Register</Text>
        </TouchableOpacity> */}
      {/* </View> */}

      {/* Newly Added */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },

  // Newly Added
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    height: 120,
  },
  cardValue: {
    fontSize: 14,
    marginTop: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2e3a59',
  },
  activityContainer: {
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    elevation: 2,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },

  // Announcmnt Screen
  announcementSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 0,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e3a59',
  },
  announcementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  announcementContent: {
    flex: 1,
  },
  announcementText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  announcementDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  notificationType: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 2,
  },
  viewMoreButton: {
    backgroundColor: '#eef3f8',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  viewMoreText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },

  // Newly Added End
});

export default TeacherDashboard;
