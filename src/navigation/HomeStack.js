import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import CustomCamera from '../screens/cameras/CustomCamera';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown:false}}
      />
        <Stack.Screen
        name="CustomCamera"
        component={CustomCamera}
        options={{headerShown:false}}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
