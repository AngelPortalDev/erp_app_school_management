import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StudentDashboard from '../screens/Dashboard/StudentDashboard';
import StudentTimeTable from '../screens/TimeTable/StudentTimeTable';
import StudentAnnouncementScreen from '../screens/Dashboard/StudentAnnouncementScreen';

const Stack = createNativeStackNavigator();

const StudentDashboardStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="StudentDashboard">
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{title: 'Dashboard',headerShown:false}}
      />
      <Stack.Screen
        name="StudentAnnouncementScreen"
        component={StudentAnnouncementScreen}
        options={{title: 'Announcement'}}
      />
      <Stack.Screen
        name="StudentTimeTable"
        component={StudentTimeTable}
        options={{title: 'Time Table'}}
      />
    </Stack.Navigator>
  );
};

export default StudentDashboardStack;
