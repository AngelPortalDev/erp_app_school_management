/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity,Text } from 'react-native';

// Dashboard Screens
import TeacherDashboard from '../screens/Dashboard/TeacherDashboard';
import AttendanceScreen from '../screens/Dashboard/AttendanceScreen';
import LeaveScreen from '../screens/Dashboard/LeaveScreen';
// import RegularizationScreen from '../screens/Attendance/RegularizationScreen';
import AnnounceMentScreen from '../screens/Dashboard/AnnounceMentScreen';
import AnnouncementDetails from '../screens/Announcement/AnnouncementDetails';
import TimeTable from '../screens/TimeTable/TimeTable';
import ApplyLeave from '../screens/Leave/ApplyLeave';
import AssignClassesScreen from '../screens/Schedule/AssignClassesScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import DisplayNotification from '../screens/Notifications/DisplayNotification';
import CustomCamera from '../screens/cameras/CustomCamera';

import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator initialRouteName="TeacherDashboard">
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboard}
        options={{ title: 'Dashboard' }}
      />
         <Stack.Screen
        name="TimeTable"
        component={TimeTable}
        // options={{ title: 'Timetable' }}
      />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ title: 'Attendance' }}
      />
      <Stack.Screen
        name="AnnounceMentScreen"
        component={AnnounceMentScreen}
        options={{ title: 'Announcement' }}
      />
       <Stack.Screen
        name="AnnouncementDetails"
        component={AnnouncementDetails}
        options={{ title: 'Announcement Details' }}
      />
      <Stack.Screen
        name="Leave"
        component={LeaveScreen}
        options={{ title: 'Leave Requests' }}
      />
       <Stack.Screen
        name="ApplyLeave"
        component={ApplyLeave}
        // options={{ title: 'Apply Leave' }}
      />
      <Stack.Screen
        name="AssignedClass"
        component={AssignClassesScreen}
        options={{ title: 'Assign Class' }}
      />

{/* <Stack.Screen
  name="NotificationsScreen"
  component={NotificationsScreen}
  options={({ navigation }) => ({
    title: 'Notification',
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ marginLeft: 10 }}><Icon name="arrow-back-outline" size={20} color="#000000" /></Text>
      </TouchableOpacity>
    ),
  })}
/> */}


    </Stack.Navigator>
  );
};

export default DashboardStack;
