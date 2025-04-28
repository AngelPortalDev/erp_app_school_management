import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  Camera,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import {getCurrentLocation} from '../../helper/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import {BASE_URL} from '@env';

const CustomCamera = ({navigation, route}) => {
  // console.log('route',route);
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      const micPermission = await Camera.getMicrophonePermissionStatus();

      if (cameraPermission !== 'authorized') {
        await requestPermission();
      }

      if (micPermission !== 'authorized') {
        await Camera.requestMicrophonePermission();
      }
    };

    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePicture = async () => {
    if (cameraRef.current == null) {
      return;
    }

    try {
      setLoading(true);
      const photo = await cameraRef.current.takePhoto({flash: 'off'});
      console.log('Photo:', photo);
      const photoPath = 'file://' + photo.path;
      setPhotoUri(photoPath);

      getCurrentLocation(async (latitude, longitude) => {
        const formData = new FormData();

        formData.append('lecture_id', route.params?.lecture_id);
        formData.append('class_id', route.params?.class_id);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('action', route.params?.action);
        formData.append('module_id', route.params?.module_id);
        formData.append('image', {
          uri: photoPath,
          name: 'checkin' + `${route.params?.lecture_id}.jpg`,
          type: 'image/jpeg',
        });

        // console.log('lecture_id',route.params?.lecture_id);
        // console.log('class_id', route.params?.class_id);
        // console.log('latitude', latitude);
        // console.log('longitude', longitude);
        // console.log('action', route.params?.action);
        // console.log('image',photoPath);
        // console.log('module_id',route.params?.module_id);


        const token = await AsyncStorage.getItem('token');

        try {
          const response = await Axios.post(
            `${BASE_URL}/mark-attendance/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Token ${token}`,
              },
            },
          );

          console.log('response check in / checkout', response);
          setLoading(false); 
          console.log('formData', formData);


          if (response.status === 200) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'TeacherDashboard',
                  params: {
                    checkIn: route.params?.action === 'checkin',
                    checkOut: route.params?.action === 'checkout',
                  },
                },
              ],
            });
          }
           else {
            Alert.alert('Error', 'Unable to mark attendance');
          }
        } catch (e) {
          setLoading(false); 
          if (e.response) {
            // Server responded with a status code outside 2xx
            console.error('Server Error:', e.response.data);
            console.error('Status Code:', e.response.status);
            console.error('Headers:', e.response.headers);
            Alert.alert('Error', `Server Error: ${e.response.status}`);
          } else if (e.request) {
            // Request was made but no response received
            console.error('No Response:', e.request);
            Alert.alert('Error', 'No response from server');
          } else {
            // Something else happened
            console.error('Other Error:', e.message);
            Alert.alert('Error', e.message);
          }
        }
      });
    } catch (e) {
      setLoading(false);
      console.error('Error taking photo:', e);
    }
  };

  if (device == null) {
    return <ActivityIndicator />;
  }
  if (!hasPermission) {
    return <Text>Camera permission required</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
          <Icon name="camera" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      {photoUri && (
        <View style={styles.previewContainer}>
          <Image source={{uri: photoUri}} style={styles.previewImage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  captureButton: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 50,
    opacity: 0.8,
  },
  previewContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  previewImage: {
    width: 100,
    height: 120,
  },
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default CustomCamera;
