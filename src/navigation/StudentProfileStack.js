import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BASE_URL_NEW,BASE_URL} from '@env';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTeacherProfile} from '../store/profileSlice';
import { logout } from '../store/authSlice';

// Sample teacher profile image
const studentImage =
  'https://stthomasschoolranchi.com/wp-content/uploads/2019/04/t20-5.jpg';

const StudentProfileStack = ({navigation}) => {
 const dispatch = useDispatch();
  const {profile,loading} = useSelector(state => state.teacher);


  useEffect(() => {
    if (!profile) {
      dispatch(getTeacherProfile());
    }
  }, [profile, dispatch]);


  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout',
      [
        {text:'cancel',style:'cancel'},
        {
          text:'Yes',
          onPress: async ()=>{
            try{
              await AsyncStorage.removeItem('token');
              dispatch(logout());
            }catch(error){
              Alert.alert('Error', 'Something went wrong while logging out.');
            }
          }
        }
      ],
      { cancelable: true }
    )
  };


   if (loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      );
    }

  const ProfileOption = ({label, value}) => (
    <View style={styles.optionRow}>
      <Text style={styles.optionLabel}>{label}</Text>
      <Text style={styles.optionValue}>{value}</Text>
    </View>
  );



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
                ? `${BASE_URL_NEW}/${profile.profile_picture}`
                : studentImage,
            }}
            style={styles.profileImage}
          />
          <Text style={styles.teacherName}>{profile?.first_name || 'N/A'}</Text>
          <Text style={styles.teacherRole}>{profile?.role_display || 'N/A'}</Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditStudentProfile')}>
            <Text style={styles.editProfileText}>Edit Profile </Text>
          </TouchableOpacity>
        </View>

        {/* Student Info sections */}

        <View style={styles.optionsContainer}>
          <ProfileOption label="Username" value={profile?.username || 'N/A'} />
          <ProfileOption label="Student Id" value="STD11003" />
          <ProfileOption
            label="Mobile No"
            value={profile?.contact_number || 'N/A'}
          />
          <ProfileOption label="Email" value={profile?.email || 'N/A'} />
          <ProfileOption label="Address" value={profile?.address || 'N/A'} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default StudentProfileStack;

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
    borderWidth: 3,
    borderColor: '#be012f',
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
    backgroundColor: '#be012f',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#1e90ff',
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
    backgroundColor: '#be012f',
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 0,
    shadowColor: '#be012f',
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
