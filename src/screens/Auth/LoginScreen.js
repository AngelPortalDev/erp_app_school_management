import React, {useCallback, useEffect, useState} from 'react';
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
  RefreshControl
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
  const [refreshing,isRefreshing] = useState(false);
  const [formKey, setFormKey] = useState(0);

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

  const handleLogin = async values => {
    const {username, password} = values;
    try {
      const result = await dispatch(loginUser({username, password})).unwrap();

      const token = await AsyncStorage.getItem('token');
      if (!token){
        throw new Error('No token found');
      }

      const fcmToken = await messaging().getToken();
      await Axios.post(
        `${BASE_URL}/register-device/`,
        {fcm_token: fcmToken},
        {
          headers: {Authorization: `Token ${token}`},
        },
      );

      navigation.replace('BottomTab');
    } catch (err) {
      console.log('Login Error:', err);
      // Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };
  

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('New Notification', remoteMessage.notification?.body || 'You received a new message.');
    });
    return unsubscribe;
  }, []);


  const onRefresh = useCallback(()=>{
    isRefreshing(true);
    setFormKey(prevKey => prevKey + 1);
    setTimeout(()=>{
      isRefreshing(false);
    },1000);
  },[]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require('../../../assets/AuthenticationImages/Login-10.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heading}>Welcome Back 👋</Text>
          <Text style={styles.subText}>Log in to your account to continue</Text>

          <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            key={formKey}
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
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                    style={styles.textInput}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                      style={[styles.textInput, {paddingRight: 40}]}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}>
                      <Icon
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={20}
                        color="#777"
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
                  <Text style={styles.forgotPassText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} disabled={loading} onPress={handleSubmit}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Log In</Text>
                  )}
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 10,
    alignItems: 'center',
  },
  logo: {
    height: 160,
    width: 160,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 5,
  },
  subText: {
    fontSize: 15,
    color: '#777',
    marginBottom: 25,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginLeft: 5,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#333',
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 14,
  },
  forgotPassContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPassText: {
    color: '#2b61ff',
    fontWeight: '500',
    fontSize: 13,
  },
  button: {
    width: '100%',
    backgroundColor: '#bc0f2c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default LoginScreen;
