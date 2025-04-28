/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeaveScreen = ({navigation, route}) => {
  const [leaveData, setLeaveData] = useState([]);
  const [leaveApplication, setLeaveApplication] = useState([]);
  console.log('route', route.params?.leave_status);

  useEffect(() => {
    const getLeaveData = async () => {
      console.log('get leave data');
      try {
        console.log('adding...');
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          return 'No Authentication';
        }

        const response = await Axios.get(`${BASE_URL}/leavedata/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log('response.data', response);
        setLeaveData(response.data.leavedata.leave_types);
        setLeaveApplication(response.data.leavedata.leave_applications);
      } catch (err) {
        console.log(err, 'err');
      }
    };
    getLeaveData();
  }, []);

  const totalMaxDays = leaveData.reduce(
    (total, leave) => total + leave.available,
    0,
  );

  // const getTotalLeaveCount =

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <Icon name="chart-donut" size={28} color="#1E90FF" />
          <View style={{marginLeft: 12}}>
            <Text style={styles.summaryTitle}>Total Leaves Remaining</Text>
            <Text style={styles.summaryValue}>{totalMaxDays}</Text>
          </View>
        </View>

        {/* Leave Type Cards */}
        <Text style={styles.header}>Your Leave Balance</Text>
        <View style={styles.cardsContainer}>
          {leaveData.map((leave, index) => {
            const iconMap = {
              'Casual Leave': 'beach',
              'Paid Leave': 'wallet',
              'Sick Leave': 'hospital-box',
              'Maternity Leave': 'baby-carriage',
            };

            const colorMap = {
              'Casual Leave': '#4ECDC4',
              'Paid Leave': '#FFD93D',
              'Sick Leave': '#FF6B6B',
              'Maternity Leave': '#A29BFE',
            };

            const booked = leave.used;
            const balance = leave.max_days;
            const total = booked + balance;
            const progress = total > 0 ? (booked / total) * 100 : 0;

            return (
              <View
                key={index}
                style={[
                  styles.leaveCard,
                  {borderLeftColor: colorMap[leave.name] || '#ccc'},
                ]}>
                <View style={styles.leaveHeader}>
                  <Icon
                    name={iconMap[leave.name] || 'calendar'}
                    size={28}
                    color={colorMap[leave.name] || '#333'}
                  />
                  <Text style={styles.leaveTitle}>{leave.name}</Text>
                </View>

                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${progress}%`,
                        backgroundColor: colorMap[leave.name] || '#999',
                      },
                    ]}
                  />
                </View>

                <View style={styles.leaveStats}>
                  <Text style={styles.leaveStatText}>
                    Booked: {booked} Days
                  </Text>
                  <Text style={styles.leaveStatText}>
                    Balance: {balance} Days
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Leaves View */}
        <View style={styles.applicationContainer}>
          <Text style={styles.applicationHeader}>
            Recent Leave Applications
          </Text>

          {leaveApplication.length === 0 ? (
            <Text style={styles.noApplicationText}>
              No leave applications found.
            </Text>
          ) : (
            leaveApplication.map((data, index) => (
              <View key={index} style={styles.applicationCard}>
                <View style={styles.applicationRow}>
                  <Text style={styles.applicationType}>
                    {data.leave_type} Leave
                  </Text>
                  <Text style={styles.applicationDays}>
                    {route.params?.leave_days
                      ? `${route.params.leave_days} Days`
                      : ''}
                  </Text>
                </View>

                <Text style={styles.applicationDate}>
                  {data.start_date} - {data.end_date}
                </Text>

                <View style={styles.statusBadgeContainer}>
                  <Text
                    style={[
                      styles.statusBadgeCommon,
                      data.status === 'Approved'
                        ? styles.statusApproved
                        : data.status === 'Rejected'
                        ? styles.statusRejected
                        : styles.statusPending,
                    ]}>
                    {data.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity style={styles.button}>
        <Icon
          name="calendar-plus"
          size={20}
          color="#fff"
          style={{marginRight: 10}}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ApplyLeave')}>
          <Text style={styles.buttonText}>Apply for Leave </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default LeaveScreen;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  summaryTitle: {
    fontSize: 14,
    color: '#555',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: width / 2 - 24,
    height: 120,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cardCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  recentContainer: {
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  footerMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
  button: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: '#ff5a5f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  leaveCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    borderLeftWidth: 0.5,
  },

  leaveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  leaveTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },

  progressBar: {
    height: '100%',
    borderRadius: 5,
  },

  leaveStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leaveStatText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  // Recent Leave View

  applicationContainer: {
    marginTop: 30,
  },

  applicationHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1A1A1A',
  },

  noApplicationText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },

  applicationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },

  applicationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  applicationType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  applicationDays: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E90FF',
  },

  applicationDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },

  statusBadgeContainer: {
    alignItems: 'flex-start',
  },

  statusBadgeCommon: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  statusApproved: {
    backgroundColor: '#E6F4EA',
    color: '#218838',
  },
  statusRejected: {
    backgroundColor: '#FDECEA',
    color: '#C82333',
  },
  statusPending: {
    backgroundColor: '#FFF9E6',
    color: '#FFB400',
  },
});
