import { Image, StyleSheet, Platform } from 'react-native';
import { ScrollView, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text> Voulenteer </Text>

      <Link href="/auth/LoginScreen" style={styles.link}>/auth/LoginScreen</Link>
      <Link href="/auth/NgoLoginScreen" style={styles.link}>/auth/NgoLoginScreen</Link>
      <Link href="/auth/SignupScreen" style={styles.link}>auth/SignupScreen</Link>
      <Link href="/event/AddEvent" style={styles.link}>event/AddEvent</Link>
      <Link href="/event/AproveEvent" style={styles.link}>event/AproveEvent</Link>
      <Link href="/NGO/AddNgo" style={styles.link}>/NGO/AddNgo</Link>
      <Link href="/profile/AdminProfileScreen" style={styles.link}>/profile/AdminProfileScreen</Link>
      <Link href="/profile/NgoProfileScreen" style={styles.link}>/profile/NgoProfileScreen</Link>
      <Link href="/profile/VolunteerProfileScreen" style={styles.link}>/profile/VolunteerProfileScreen</Link>
      <Link href="/NGO/AddNgo" style={styles.link}>/NGO/AddNgo</Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
   flex:1,
   justifyContent:'center',
   alignItems:'center'
  },
  link:{
    margin:10,
  }
});
