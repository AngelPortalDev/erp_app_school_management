import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AnnouncementDetails = ({ route }) => {

    const { announcement } = route.params;

    console.log('announcement',announcement);

    const stripHtmlTags = (html) => html.replace(/<[^>]+>/g, '').trim();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.header}>
        <Ionicons name="megaphone-outline" size={28} color="#4a90e2" />
        <Text style={styles.title}>{announcement.title}</Text>
      </View>

      <Text style={styles.time}>{announcement.created_at}</Text>

      <View style={styles.card}>
        <Text style={styles.message}>
        {stripHtmlTags(announcement.message)}
        </Text>

        {/* <Text style={styles.message}>
          📅 <Text style={styles.bold}>Date:</Text> April 20th, 2025{'\n'}
          🕐 <Text style={styles.bold}>Time:</Text> 1:00 AM – 3:00 AM (UTC){'\n\n'}
          🔧 During this period, access to some services may be temporarily unavailable. We apologize for any inconvenience this may cause.
        </Text> */}

        <Text style={styles.thankYou}>Thank you for your understanding 🙏</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e3a59',
    flexShrink: 1,
  },
  time: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  message: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 14,
  },
  bold: {
    fontWeight: '600',
    color: '#2e3a59',
  },
  thankYou: {
    fontSize: 14,
    color: '#4a90e2',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
  },
});

export default AnnouncementDetails;
