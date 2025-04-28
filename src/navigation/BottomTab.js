import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import TeacherDashboard from '../screens/Dashboard/TeacherDashboard';
import ProfileStack from './ProfileStack';
import DashboardStack from './DashboardStack';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const renderTabBarIcon =
  name =>
  ({color, size}) => {
    return <Icon name={name} color={color} size={size} />;
  };

const BottomTab = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarIcon: renderTabBarIcon('home-outline')}}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{tabBarIcon: renderTabBarIcon('school-outline')}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{tabBarIcon: renderTabBarIcon('person-outline')}}
      />
    </Tab.Navigator>
  );
};
export default BottomTab;
