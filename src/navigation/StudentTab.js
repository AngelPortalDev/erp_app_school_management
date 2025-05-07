import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import StudentDashboardStack from './StudentDashboardStack';
import StudentProfileStack from './StudentProfileStack';

const Tab = createBottomTabNavigator();

const renderTabBarIcon =
  name =>
  ({color, size}) => {
    return <Icon name={name} color="#be012f" size={size} />;
  };
const StudentTab = () => {
  return (
    <>
     <Tab.Navigator screenOptions={{headerShown: true}}>
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboardStack}
        options={{
          tabBarIcon: renderTabBarIcon('school-outline'),
          tabBarActiveTintColor: 'be012f',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={StudentProfileStack}
        options={{
          tabBarIcon: renderTabBarIcon('person-outline'),
          tabBarActiveTintColor: 'be012f',
        }}
      />
    </Tab.Navigator>
    </>
  );
};

export default StudentTab;
