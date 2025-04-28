import Geolocation from 'react-native-geolocation-service';
import { Alert } from 'react-native';

export const getCurrentLocation = (onSuccess, onError) => {
  Geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      onSuccess(latitude, longitude);
    },
    error => {
      console.error('Location Error:', error);
      if (onError) {
        onError(error);
      } else {
        Alert.alert('Location Error', error.message);
      }
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
  );
};
