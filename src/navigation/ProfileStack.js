import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TeacherProfileScreen from '../screens/Profile/TeacherProfileScreen';
import EditTeacherProfileScreen from '../screens/Profile/EditTeacherProfileScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TeacherProfile"
        component={TeacherProfileScreen}
        options={{title: 'My Profile'}}
      />
      <Stack.Screen
        name="EditTeacherProfile"
        component={EditTeacherProfileScreen}
        options={{title: 'Edit Profile'}}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
