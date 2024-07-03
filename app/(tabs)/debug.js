import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '@/AuthContext';
import { router, Link } from 'expo-router';

export default function DebugScreen() {
  const { resetApp } = useContext(AuthContext);

  const handleReset = async () => {
    await resetApp();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Menu</Text>
      <Button title="Reset App and Clear Data" onPress={handleReset} />

      <Link href="/event/AddEvent" style={styles.link}>event/AddEvent</Link>
      <Link href="/event/AproveEvent" style={styles.link}>event/AproveEvent</Link>
      <Link href="/NGO/AddNgo" style={styles.link}>/NGO/AddNgo</Link>
      <Link href="/NGO/AddMembers" style={styles.link}>/NGO/AddMembers</Link>
      <Link href="/profile/AdminProfileScreen" style={styles.link}>/profile/AdminProfileScreen</Link>
      <Link href="/profile/NgoProfileScreen" style={styles.link}>/profile/NgoProfileScreen</Link>
      <Link href="/profile/VolunteerProfileScreen" style={styles.link}>/profile/VolunteerProfileScreen</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    fontSize: 14,
    marginTop: 20,
  }
});
