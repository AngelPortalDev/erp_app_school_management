import React from 'react';
import LoginScreen from '../screens/Auth/LoginScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{title:'Login',headerBackVisible:false}}/>
      {/* <Stack.Screen name="Home" component={HomeScreen} options={{title:'Home'}}/> */}
      <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} options={{title:'Forgot Password'}}/>
    </Stack.Navigator>
  );
};
export default AuthStack;
