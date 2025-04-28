import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Axios from 'axios';
import {BASE_URL} from '@env';
import {useSelector, useDispatch} from 'react-redux';
import {getTeacherProfile} from '../../store/profileSlice';
import {Buffer} from 'buffer';

const TimeTable = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const {profile} = useSelector(state => state.teacher);
  const dispatch = useDispatch();


  useEffect(() => {
    if (!profile) {
      dispatch(getTeacherProfile());
    }
  }, [profile, dispatch]);

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const fetchClassesForDate = async date => {
    if (!profile || !profile.user) {
      return;
    }
    setLoading(true);
    try {
      const teacherId = Buffer.from(`${profile.user}`).toString('base64');
      const selected = new Date(date);
      const month = selected.getMonth() + 1;
      const year = selected.getFullYear();
      const response = await Axios.get(
        `${BASE_URL}/get-teacher-timetable/${teacherId}/?month=${month}&year=${year}`,
      );
      const timetable = response.data.timetable || {};
      const formattedDate = date.split('-').reverse().join('-');
      setClasses(timetable[formattedDate] || []);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile && selectedDate) {
      fetchClassesForDate(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, selectedDate]);

  const formatHeaderDate = date => {
    const d = new Date(date);
    const options = {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
  };

  if (!profile) {
    return <ActivityIndicator size="large" color="#4a90e2" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <Calendar
          style={{width: '100%'}}
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#4a90e2',
            },
          }}
          theme={{
            selectedDayBackgroundColor: '#4a90e2',
            todayTextColor: '#4a90e2',
          }}
          renderHeader={date => {
            return (
              <Text style={styles.customHeaderText}>
                {formatHeaderDate(date)}
              </Text>
            );
          }}
        />
      </View>

      <Text style={styles.dateTitle}>Schedule for {selectedDate}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : classes.length > 0 ? (
        <FlatList
          data={classes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.classText}>Class: {item.class}</Text>
              <Text style={styles.subjectText}>Subject: {item.subject}</Text>
              <Text style={styles.timeText}>Time: {item.time_range}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noClassText}>
          No classes scheduled for this date.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  customHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    color: '#2e3a59',
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    padding: 0,
    width: '100%',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#2e3a59',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    elevation: 2,
  },
  classText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a90e2',
  },
  subjectText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  timeText: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },
  noClassText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});

export default TimeTable;
