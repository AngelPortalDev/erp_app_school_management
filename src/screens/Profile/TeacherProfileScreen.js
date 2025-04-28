import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {logout} from '../../store/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTeacherProfile} from '../../store/profileSlice';

// Sample teacher profile image
const teacherImage =
  'https://stthomasschoolranchi.com/wp-content/uploads/2019/04/t20-5.jpg';

const TeacherProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {profile} = useSelector(state => state.teacher);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              dispatch(logout());
              Alert.alert(
                'Success',
                'Logout Successful!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.getParent()?.replace('Login');
                    },
                  },
                ],
                { cancelable: false }
              );
            } catch (error) {
              Alert.alert('Error', 'Something went wrong while logging out.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  useEffect(() => {
    dispatch(getTeacherProfile());
  }, [dispatch]);

  return (
    <ScrollView
      bounces={false}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      style={styles.scrollView}>
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: profile?.profile_picture
                ? `http://192.168.1.46:1000${profile.profile_picture}`
                : teacherImage,
            }}
            style={styles.profileImage}
          />

          <Text style={styles.teacherName}>Dhruv</Text>
          <Text style={styles.teacherRole}>teacher</Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditTeacherProfile')}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <ProfileOption label="Username" value={profile?.username || 'N/A'} />
          <ProfileOption label="Employee Id" value="EMP11003" />
          <ProfileOption
            label="Mobile No"
            value={profile?.contact_number || 'N/A'}
          />
          <ProfileOption label="State" value={profile?.state || 'N/A'} />
          <ProfileOption label="Location" value={profile?.address || 'N/A'} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Profile Option Component
const ProfileOption = ({label, value}) => (
  <View style={styles.optionRow}>
    <Text style={styles.optionLabel}>{label}</Text>
    <Text style={styles.optionValue}>{value}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f0f0f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#eee',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ff5a5f',
    marginBottom: 15,
  },
  teacherName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  teacherRole: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  editProfileButton: {
    backgroundColor: '#ff5a5f',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#ff5a5f',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
  },
  editProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#eee',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
    padding: 20,
  },
  optionRow: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  optionValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#ff5a5f',
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d9534f',
    shadowColor: '#d9534f',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
});

export default TeacherProfileScreen;
