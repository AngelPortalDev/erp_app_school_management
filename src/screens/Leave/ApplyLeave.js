/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import Axios from 'axios';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';

const leaveOptions = [
  {label: 'Sick Leave', value: 'sick'},
  {label: 'Casual Leave', value: 'casual'},
  {label: 'Paid Leave', value: 'paid'},
  {label: 'Maternity Leave', value: 'maternity'},
  {label: 'Other Leave', value: 'Other'},
];

const ApplyLeave = ({navigation}) => {
  const [leaveType, setLeaveType] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);

  const [endDate, setendDate] = useState(new Date());
  const [showToPicker, setShowToPicker] = useState(false);

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim() || !leaveType || !startDate || !endDate) {
      Alert.alert(
        'Missing Fields',
        'Please fill all the fields before applying.',
      );
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token', token);
      if (!token) {
        return 'No Authentication';
      }

      const formData = new FormData();
      console.log('formData', formData);
      formData.append('leave_type', leaveType);
      formData.append('start_date', startDate.toISOString().split('T')[0]);
      formData.append('end_date', endDate.toISOString().split('T')[0]);
      formData.append('reason', reason);

      const response = await Axios.post(`${BASE_URL}/apply-leaves/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Calculate number of days between start and end date
      console.log('response', response);
      Alert.alert('Success', 'Leave applied successfully.');
      setLoading(false);
      navigation.navigate('Leave', {});
    } catch (err) {
      setLoading(false);
      if (err.response) {
        Alert.alert(
          'Error',
          err.response.data.message || 'Something went wrong.',
        );
        return;
      } else if (err.request) {
        console.log('No response received:', err.request);
      } else {
        console.log('Request setup error:', err.message);
      }
    }
  };

  const handleReasonChange = text => {
    if (text.length > 200) {
      Alert.alert(
        'Character Limit Exceeded',
        'Reason must not exceed 200 characters.',
      );
      return;
    }
    setReason(text);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Reason for Leave</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter reason.."
          value={reason}
          onChangeText={setReason}
          multiline={true}
          onChange={handleReasonChange}
        />

        <Text style={styles.label}>Leave Type</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: '#ff5a5f'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={leaveOptions}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={'Select Leave Type'}
          searchPlaceholder="Search..."
          value={leaveType}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setLeaveType(item.value);
            setIsFocus(false);
          }}
        />

        <Text style={styles.label}>From</Text>
        <TouchableOpacity
          onPress={() => setShowFromPicker(true)}
          style={styles.datePicker}>
          <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
          <Icon name="calendar-month-outline" size={20} color="#be012f" />
        </TouchableOpacity>
        {showFromPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFromPicker(Platform.OS === 'ios');
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>To</Text>
        <TouchableOpacity
          onPress={() => setShowToPicker(true)}
          style={styles.datePicker}>
          <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
          <Icon name="calendar-month-outline" size={20} color="#be012f" />
        </TouchableOpacity>
        {showToPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowToPicker(Platform.OS === 'ios');
              if (selectedDate) {
                setendDate(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.applyButton, loading && {opacity: 0.7}]}
          disabled={loading}
          onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.applyText}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 16,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F3F4F6',
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
  },
  placeholderStyle: {
    color: '#999',
    fontSize: 14,
  },
  selectedTextStyle: {
    color: '#333',
    fontSize: 14,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modeSelected: {
    backgroundColor: '#ff5a5f',
    borderColor: '#ff5a5f',
  },
  modeText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
  modeTextSelected: {
    color: '#fff',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  dateText: {
    color: '#333',
    fontSize: 14,
  },
  applyButton: {
    marginTop: 24,
    backgroundColor: '#be012f',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ApplyLeave;
