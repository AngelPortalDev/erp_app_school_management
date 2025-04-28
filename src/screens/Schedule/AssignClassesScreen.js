/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState,useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Axios from 'axios';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {getTeacherProfile} from '../../store/profileSlice';
import {Buffer} from 'buffer';




const AssignClassesScreen = () => {
const {profile} = useSelector(state => state.teacher);
const dispatch = useDispatch();
const userProfileId = profile?.user || '';

const [isLoading, setIsLoading] = useState(true);
const [classData, setClassData] = useState([]);

// convert teacher id into an base 64
const teacherId = useMemo(() => {
  if (userProfileId) {
    return Buffer.from(String(userProfileId)).toString('base64');
  }
  return '';
}, [userProfileId]);

// get teacher profile
useEffect(() => {
  if (!profile) {
    dispatch(getTeacherProfile());
  } else {
    setIsLoading(false);
  }
}, [profile, dispatch]);


const getClassesData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token || !teacherId) {
      return;
    }

    const response = await Axios.get(`${BASE_URL}/assginclass/${teacherId}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const mappedClassData = response.data.data.map(item => ({
      course: item.course,
      classes: item.classes.split(', '),
      modules: item.modules.split(', '),
      intake: item.intakemonth,
    }));
    setClassData(mappedClassData);
  } catch (err) {
    console.log(err, 'err');
  }
};

useEffect(() => {
  if (!isLoading) {
    getClassesData();
  }
}, [isLoading]);

const renderItem = ({item}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.courseTitle}>{item.course}</Text>

      <View style={styles.chipContainer}>
        {item.classes.map((cls, idx) => (
          <View key={idx} style={styles.chip}>
            <Text style={styles.chipText}>{cls}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modules</Text>
        {item.modules.map((mod, idx) => (
          <Text key={idx} style={styles.moduleText}>
            • {mod}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.intakeBadge}>{item.intake}</Text>
      </View>
    </View>
  );
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Assigned Classes</Text>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2b61ff" /> {/* Customize color and size */}
          <Text style={styles.loaderText}>Loading your classes...</Text>
        </View>
      ) : (
        <FlatList
          data={classData}
          keyExtractor={item => item.course + item.intake}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2b61ff',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#e0ecff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#2b61ff',
    fontWeight: '500',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 4,
  },
  moduleText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 6,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  intakeBadge: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
});

export default AssignClassesScreen;
