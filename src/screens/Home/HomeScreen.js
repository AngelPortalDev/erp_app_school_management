/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {getTeacherProfile} from '../../store/profileSlice';

import {
  Button as PaperButton,
  Dialog,
  Portal,
  PaperProvider,
  Text as PaperText,
} from 'react-native-paper';
import {BASE_URL} from '@env';
import {Buffer} from 'buffer';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCurrentLocation} from '../../helper/location';


console.log('BASE_URL',BASE_URL);

const HomeScreen = ({navigation, route}) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dialogType, setDialogType] = useState('checkin');
  const [loading, setLoading] = useState(false);
  const [activeLecture, setActiveLecture] = useState(null);
  const [allLectures, setAllLectures] = useState([]);
  const [hasCheckout, setHasCheckout] = useState(false);
  const [checkedInbackedTime,setCheckedInBackedTime] = useState(false);


  const timerRef = useRef(null);
  const {profile} = useSelector(state => state.teacher);
  const dispatch = useDispatch();

  // get profile data
  useEffect(() => {
    if (!profile) {
      dispatch(getTeacherProfile());
    }
  }, [profile, dispatch]);


  // Fetch teacher Classes
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      if (!profile || !profile.user) {
        return;
      }
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('No Token Found');
          return;
        }
        const teacherId = Buffer.from(`${profile.user}`).toString('base64');
        const response = await Axios.get(
          `${BASE_URL}/attendance/${teacherId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        console.log('response', response);
        setAllLectures(response.data.today_lectures);
        const now = new Date();

        const ongoingLecture = response.data.today_lectures.find(lecture => {
          const [startHour, startMinute] = lecture.start_time
            .replace(/ AM| PM/, '')
            .split(':')
            .map(Number);

          const [endHour, endMinute] = lecture.end_time
            .replace(/ AM| PM/, '')
            .split(':')
            .map(Number);

          const isStartPM = lecture.start_time.includes('PM');
          const isEndPM = lecture.end_time.includes('PM');
          const start = new Date();
          // console.log('start',start.toString());
          start.setHours(
            isStartPM && startHour < 12 ? startHour + 12 : startHour,
          );
          // false && 11 < 12 ? 11:26 + 12 =  23:26 : 11:26
          start.setMinutes(startMinute);
          start.setSeconds(0);

          const end = new Date();
          end.setHours(isEndPM && endHour < 12 ? endHour + 12 : endHour);
          end.setMinutes(endMinute);
          end.setSeconds(0);

          return now >= start && now <= end;
        });
        console.log('checked in', checkedIn);

        setCheckedIn(response.data.is_checked_in);
        setCheckedInBackedTime(response.data.checkin_time);
        setActiveLecture(ongoingLecture || null);
        if (response.data.checkin_time) {
          const checkInDate = new Date(response.data.checkin_time);
          const timenow = new Date();
          const diffInSeconds = Math.floor((timenow - checkInDate) / 1000);
          setElapsedTime(diffInSeconds);
        }
      } catch (error) {
        console.log('Error fetching timetable:', error);
        if (error.response) {
          console.log('Error Status:', error.response.status);
          console.log('Error Headers:', error.response.headers);
          console.log('Error Data:', error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherClasses();
  }, [profile]);


  const showDialog = (type = 'checkin') => {
    setDialogType(type);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  // Stop the current ongoing time
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        // console.log('timerRef.current',timerRef.current);
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return (
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      if (navigation && navigation.getState) {
        const routeState = navigation.getState();
        const routes = routeState.routes;
        const currentRoute = routes[routes.length - 1];
        console.log('currentRoute', currentRoute);

        if (currentRoute.params?.checkIn) {
          performAutoCheckIn();
          // Remove the flag so it doesn’t trigger every time
          navigation.setParams({checkIn: false});
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]),
  );

  // ********* For  checkin ************
  const performAutoCheckIn = () => {
    getCurrentLocation(
      (latitude, longitude) => {
        const currentTime = new Date();
        console.log('location', latitude, longitude);
        setCheckInTime(currentTime);
        setCheckedIn(true);
        setCheckOutTime(null);
        setElapsedTime(0);
        showDialog('checkin');
      },
      error => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Location Error',
          text2: error.message,
        });
      },
    );
  };

  // ****** for given camra permission & redirected camera ******
  const handleCheckIn = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permissions Required',
        'Camera and Location permissions are required.',
        [{text: 'OK'}],
      );
      return;
    }
    navigation.navigate('CustomCamera', {
      action: 'checkin',
      lecture_id: activeLecture?.id,
      class_id: activeLecture?.class_id,
      module_id: activeLecture?.module_id,
    });
  };

  // ******* for checkout ***********
  useEffect(() => {
    if (route.params?.checkOut) {

      const currentTime = new Date();
      setCheckOutTime(currentTime.toLocaleTimeString());
      setCheckedIn(false);
      setHasCheckout(true);
      showDialog('checkout');

      navigation.setParams({ checkOut: false });
    }
  }, [route.params?.checkOut]);


  // ************* for given permission & navigate **********
  const handleCheckOut = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permissions Required',
        'Camera and Location permissions are required.',
        [{text: 'OK'}],
      );
      return;
    }
    navigation.navigate('CustomCamera', {
      action: 'checkout',
      lecture_id: activeLecture?.id,
      class_id: activeLecture?.class_id,
      module_id: activeLecture?.module_id,
    });
    // await AsyncStorage.setItem(`checkedOutLecture_${activeLecture.id}`,'true');
    // await AsyncStorage.removeItem(`checkedOutLecture_${activeLecture.id}`);
    setHasCheckout(true);
  };

  //*********** */ for running timing ************
  useEffect(() => {
    if (checkedIn) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [checkedIn]);



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2b61ff" />
      </View>
    );
  }
  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <View style={styles.clockCard}>
          <View style={styles.clockIconWrapper}>
            <Icon name="timer-outline" size={30} color="#fff" />
          </View>
          {activeLecture && (
            <View>
              <Text style={styles.classtextStyle}>
                {activeLecture.class_name}
              </Text>
              <Text style={styles.courseText}>{activeLecture.course_name}</Text>
              <Text style={styles.shiftText}>
                Shift: {activeLecture.start_time}-{activeLecture.end_time}
              </Text>
            </View>
          )}

          {checkedIn && activeLecture && (
            <View style={styles.timerWrapper}>
              <View style={styles.timerBox}>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeText}>
                    {String(Math.floor(elapsedTime / 3600)).padStart(2, '0')}
                  </Text>
                  <Text style={styles.unitLabel}>Hrs</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeText}>
                    {String(Math.floor((elapsedTime % 3600) / 60)).padStart(
                      2,
                      '0',
                    )}
                  </Text>
                  <Text style={styles.unitLabel}>Min</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeText}>
                    {String(elapsedTime % 60).padStart(2, '0')}
                  </Text>
                  <Text style={styles.unitLabel}>Sec</Text>
                </View>
              </View>
            </View>
          )}
          {/* 
           */}
          {checkedIn && activeLecture ? (
            <View style={styles.checkInSection}>
              <TouchableOpacity
                style={[styles.button, styles.checkOutButton]}
                onPress={handleCheckOut}>
                <Text style={styles.buttonText}>Check-Out</Text>
              </TouchableOpacity>
            </View>
          ) : checkOutTime ? (
            <View style={styles.checkoutCard}>
              <Text style={styles.checkoutText}>
                Checked Out:{' '}
                <Text style={styles.checkoutTime}>{checkOutTime}</Text>
              </Text>
            </View>
           ) : activeLecture && !hasCheckout ? (
            <TouchableOpacity
              style={[styles.button, styles.checkInButton]}
              onPress={handleCheckIn}>
              <Text style={styles.buttonText}>Check-In</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noclasssStyle}>
              No classes available at this moment.
            </Text>
          )}

        </View>
        <View>
          {allLectures && allLectures.length > 0 && (
            <View style={styles.lecturesList}>
              <Text style={styles.lectureHeading}>Today's Lectures</Text>
              {allLectures &&
                allLectures.map((lecture, index) => (
                  <View key={lecture.id} style={styles.lectureCard}>
                    <Text style={styles.lectureTitle}>
                      {lecture.course_name}
                    </Text>
                    <Text style={styles.lectureDetails}>
                      Class: {lecture.class_name}
                    </Text>
                    <Text style={styles.lectureDetails}>
                      Time: {lecture.start_time} - {lecture.end_time}
                    </Text>
                    {/* Optional: Highlight active lecture */}
                    {activeLecture?.id === lecture.id && (
                      <Text style={styles.activeLabel}>Ongoing</Text>
                    )}
                  </View>
                ))}
            </View>
          )}
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>
              {dialogType === 'checkin'
                ? 'Check-In Successful'
                : 'Check-Out Successful'}
            </Dialog.Title>
            <Dialog.Content>
              <PaperText variant="bodyMedium">
                {dialogType === 'checkin'
                  ? 'You have successfully checked in!'
                  : 'You have successfully checked out!'}
              </PaperText>
            </Dialog.Content>
            <Dialog.Actions>
              <PaperButton onPress={hideDialog}>Done</PaperButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Toast />
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 20,
  },
  clockCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
    elevation: 6,
  },
  clockIconWrapper: {
    backgroundColor: '#bc0f2c',
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
  },
  classtextStyle: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  courseText: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  shiftText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
  },
  checkInSection: {
    alignItems: 'center',
  },
  checkStatus: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    elevation: 3,
  },
  checkInButton: {
    backgroundColor: '#bc0f2c',
    marginTop: 10,
    marginBottom: 10,
  },
  checkOutButton: {
    backgroundColor: '#dc3545',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerWrapper: {
    alignItems: 'center',
    marginBottom: 15,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#356bb3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timeUnit: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  timeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  unitLabel: {
    fontSize: 12,
    color: '#d0d8e5',
    marginTop: 2,
  },
  colon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 4,
  },

  checkoutCard: {
    marginTop: 15,
    backgroundColor: '#e6f4ea',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'column',
    borderColor: '#28a745',
    borderWidth: 1,
  },

  checkoutText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
    marginTop: 0,
  },

  checkoutTime: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  noclasssStyle: {
    color: '#000',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
  },

  // Avalable List UI

  lecturesList: {
    marginTop: 10,
    paddingHorizontal: 0,
    marginBottom: 30,
  },
  lectureHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lectureCard: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  lectureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lectureDetails: {
    fontSize: 14,
    color: '#444',
  },
  activeLabel: {
    marginTop: 6,
    color: '#be012f',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
