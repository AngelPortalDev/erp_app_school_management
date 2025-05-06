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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Axios from 'axios';
import {BASE_URL} from '@env';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading,setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    setLoading(true);
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
      setLoading(false);
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
        setLoading(false);
        Alert.alert(
          'Error',
          err.response.data.message || 'Something went wrong.',
        );
      } else {
        console.log('Non-error thrown:', err);
      }
    }
  };

  useEffect(() => {
    console.log('BASE_URL:', BASE_URL);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}>
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
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor="#999"
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Send Reset Link</Text>
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#6e6e73',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3a3a3c',
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d1d6',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: '#fafafa',
    color: '#1c1c1e',
  },
  button: {
    width: '100%',
    backgroundColor: '#bc0f2c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 25,
    fontSize: 14,
    color: '#444',
  },
  linkText: {
    color: '#007aff',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
});

export default ForgotPasswordScreen;
