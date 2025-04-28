/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
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
          <View style={styles.announcementItem}>
            <View style={styles.avatar} />
            <View style={styles.announcementContent}>
              <Text style={styles.announcementText} numberOfLines={1}>
                Congratulations on Achiev
              </Text>
              <Text style={styles.announcementDate}>09 April 18:15</Text>
              <Text style={styles.notificationType}>HR NOTIFICATION</Text>
            </View>
          </View>

          <View style={styles.announcementItem}>
            <View style={styles.avatar} />
            <View style={styles.announcementContent}>
              <Text style={styles.announcementText} numberOfLines={1}>
                Upcoming SOPs & Task Tra
              </Text>
              <Text style={styles.announcementDate}>04 April 22:00</Text>
              <Text style={styles.notificationType}>HR NOTIFICATION</Text>
            </View>
          </View>

          <View style={styles.announcementItem}>
            <View style={styles.avatar} />
            <View style={styles.announcementContent}>
              <Text style={styles.announcementText} numberOfLines={1}>
                Promotion to Software Test
              </Text>
              <Text style={styles.announcementDate}>04 April 11:10</Text>
              <Text style={styles.notificationType}>HR NOTIFICATION</Text>
            </View>
          </View>

          {/* View More Button */}
          <TouchableOpacity style={styles.viewMoreButton}>
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
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  // card: {
  //   width: 350,
  //   padding: 25,
  //   borderRadius: 15,
  //   alignItems: 'center',
  // },

  //

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

  // announcementheading: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   display: 'flex',
  // },
  // announcemnetSection: {
  //   backgroundColor: '#fff',
  //   padding: 20,
  //   borderRadius: 15,
  // },

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

export default HomeScreen;
