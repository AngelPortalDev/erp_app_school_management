import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../store/authSlice';
import messaging from '@react-native-firebase/messaging';
import Axios from 'axios';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const {user, error, loading} = useSelector(state => state.auth);

  const initialFormValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Updated handleSubmit to show the Alert
  const handleLogin = async values => {
    const {username, password} = values;
    console.log(values);
    try {
      await dispatch(loginUser({username, password})).unwrap();
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return 'No Authentication';
      }
      const fcmToken = await messaging().getToken();
      console.log('fcmToken', fcmToken);
      const response = await Axios.post(
        `${BASE_URL}/register-device/`,
        {fcm_token: fcmToken},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      // Alert.alert('Login Successfull', 'You have logged in Successfull');
      console.log('response', response);
      navigation.replace('BottomTab');
    } catch (err) {
      console.log('Login Error:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require('../../../assets/AuthenticationImages/Login-01.png')}
            style={styles.logo}
          />
          <Text style={styles.heading}>Log In</Text>
          <Text style={styles.subText}>Welcome back! Log in to continue</Text>

          <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    placeholder="Enter your email "
                    placeholderTextColor="#aaa"
                    style={styles.textInput}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                  />
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor="#aaa"
                      secureTextEntry={!showPassword}
                      style={styles.textInput}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}>
                      <Icon
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={20}
                        color="#aaa"
                        style={styles.eyeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.forgotPassContainer}
                  onPress={() => navigation.navigate('Forgot Password')}>
                  <Text style={styles.forgotPassstyle}>Forgot Password ?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 350,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  forgotPassContainer: {
    alignItems: 'flex-end',
    width: '100%',
  },
  forgotPassstyle: {
    color: '#2b61ff',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 10,
  },
  logo: {
    height: 200,
    width: 200,
    marginBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'right',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 5,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#bc0f2c',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  passwordWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    bottom: -9,
    right: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 15,
    fontSize: 14,
    color: '#555',
  },
  linkText: {
    color: '#2b61ff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default LoginScreen;
