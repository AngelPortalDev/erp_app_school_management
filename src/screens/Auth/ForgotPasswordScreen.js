import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import Axios, {all} from 'axios';
import {BASE_URL} from '@env';

// console.log("BASE_URL",BASE_URL);
const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('email', email);
      const response = await Axios.post(
        `${BASE_URL}/forgot-password/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      Alert.alert(
        'Success',
        response.data.message || 'Check your email for a reset link.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (err) {
      if (err.response) {
        if (err.response) {
          Alert.alert(
            'Error',
            err.response.data.message || 'Something went wrong.',
          );
          return;
        }
      } else {
        console.log('Non-error thrown:', err);
      }
    }
  };

  useEffect(() => {
    console.log('BASE_URL:', BASE_URL);
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require('../../../assets/AuthenticationImages/ForgotPass.jpg')}
            style={styles.image}
          />
          <Text style={styles.heading}>Forgot Password?</Text>
          <Text style={styles.subText}>
            Enter your email to receive a reset link
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              style={styles.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Remembered your password?{' '}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Login')}>
              Log In
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    width: 350,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 12,
    // elevation: 6,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
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
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#bc0f2c',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
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
});

export default ForgotPasswordScreen;
