import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


const StudentDashboardStack = ({ navigation }) => {
  const cards = [
    {
      title: 'Time Table',
      icon: <Icon name="calendar-outline" size={24} color="#4a90e2" />,
      navigateTo: 'StudentTimeTable',
    },
    {
      title: 'Attendance',
      icon: <FontAwesomeIcon name="check-square-o" size={24} color="#27ae60" />,
      navigateTo: 'Attendance',
    },
    {
      title: 'Announcements',
      icon: <Icon name="megaphone-outline" size={24} color="#f39c12" />,
      navigateTo: 'StudentAnnouncementScreen',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(card.navigateTo)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>{card.icon}</View>
            <Text style={styles.cardText}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f3',
  },
  scrollView: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  iconWrapper: {
    backgroundColor: '#f2f6fb',
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
});

export default StudentDashboardStack;
